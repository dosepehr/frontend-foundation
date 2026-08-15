# Zustand

Client-side state that doesn't belong in React Query (which owns _server_
state) lives in Zustand stores under [`src/store/`](../src/store). This
document covers the `createStore` wrapper every store is built with, the
conventions for adding a new store, and the middlewares worth reaching for
beyond what `createStore` gives you by default.

---

## Files at a glance

| Concern                          | File                                                                  |
| -------------------------------- | --------------------------------------------------------------------- |
| Store factory (devtools wrapper) | [`src/utils/store/createStore.ts`](../src/utils/store/createStore.ts) |
| Example store                    | [`src/store/useSidebarStore.ts`](../src/store/useSidebarStore.ts)     |

---

## `createStore`: the baseline every store gets

```ts
// src/utils/store/createStore.ts
import type { StateCreator } from 'zustand';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export function createStore<T>(
    initializer: StateCreator<T, [['zustand/devtools', never]]>,
    name: string,
) {
    return create<T>()(
        devtools(initializer, {
            name,
            enabled: process.env.NODE_ENV === 'development',
        }),
    );
}
```

Every store is created through this helper instead of calling `create`
directly, so every store gets:

- **Redux DevTools integration** — inspect state and time-travel through
  actions in the Redux DevTools browser extension, scoped under `name` so
  multiple stores don't collide in the panel.
- **Dev-only by default** — `enabled: process.env.NODE_ENV === 'development'`
  means devtools tracking (and its small overhead) is compiled out of
  production entirely.
- **Named actions** — `set`'s third argument becomes the action label shown in
  DevTools, so updates are traceable instead of an anonymous "state change".

### Adding a new store

```ts
// src/store/useCartStore.ts
import { createStore } from '@/utils/store/createStore';

interface CartState {
    items: string[];
    add: (item: string) => void;
    clear: () => void;
}

export const useCartStore = createStore<CartState>(
    (set) => ({
        items: [],
        add: (item) =>
            set((s) => ({ items: [...s.items, item] }), false, 'cart/add'),
        clear: () => set({ items: [] }, false, 'cart/clear'),
    }),
    'CartStore',
);
```

Conventions, following [`useSidebarStore`](../src/store/useSidebarStore.ts):

- One file per store under `src/store/`, named `use<Thing>Store.ts`.
- Pass a unique, human-readable `name` (second argument) — it's what shows up
  in Redux DevTools.
- Label every `set` call with an action name (third argument) instead of
  leaving it undefined — cheap to add, and it's the difference between a
  readable DevTools timeline and a wall of "anonymous".
- Reach for a store when state is shared across components that aren't in a
  simple parent/child relationship, or needs to survive a component
  unmounting. Local `useState` is still the right default for anything
  scoped to one component tree.

---

## Middlewares worth considering

`createStore` only wires up `devtools`. The middlewares below aren't included
because most stores don't need them — but reach for one when the situation
below matches.

### `persist` — survive reloads

Syncs state to `localStorage`/`sessionStorage` (or any custom storage
matching zustand's `StateStorage` interface). Useful for sidebar-open state,
user preferences, or draft form data that should survive a refresh.

```ts
import type { StateCreator } from 'zustand';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface PrefsState {
    theme: 'light' | 'dark';
    setTheme: (theme: PrefsState['theme']) => void;
}

const initializer: StateCreator<
    PrefsState,
    [['zustand/devtools', never], ['zustand/persist', unknown]]
> = (set) => ({
    theme: 'light',
    setTheme: (theme) => set({ theme }, false, 'prefs/setTheme'),
});

export const usePrefsStore = create<PrefsState>()(
    devtools(persist(initializer, { name: 'ff-prefs' }), {
        name: 'PrefsStore',
        enabled: process.env.NODE_ENV === 'development',
    }),
);
```

Notes:

- Middleware **order matters** for both behavior and types: `devtools` should
  wrap `persist` (outermost), not the other way around, so DevTools sees the
  hydrated state rather than persist's internal bookkeeping.
- `persist`'s storage key (`name` in its options, `'ff-prefs'` above) is a
  different string than the `devtools` `name` — don't reuse the store's
  DevTools name for it, or a rename of one will silently break the other.
- `createStore` doesn't support `persist` as-is (its `StateCreator` type is
  pinned to the `devtools`-only mutator tuple) — a persisted store is written
  directly with `create` + `devtools` + `persist`, as above, rather than
  through `createStore`.
- Don't persist anything that goes stale or is sensitive — auth tokens
  already live in cookies (see the root README), not here.

### `immer` — mutate-looking updates

Lets you write `state.items.push(x)` instead of `{ items: [...state.items, x] }`.
Purely a DX win once state gets nested — the underlying state is still
replaced immutably under the hood.

```ts
import type { StateCreator } from 'zustand';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface TodosState {
    todos: { id: string; done: boolean }[];
    toggle: (id: string) => void;
}

const initializer: StateCreator<
    TodosState,
    [['zustand/devtools', never], ['zustand/immer', never]]
> = (set) => ({
    todos: [],
    toggle: (id) =>
        set(
            (s) => {
                const todo = s.todos.find((t) => t.id === id);
                if (todo) todo.done = !todo.done;
            },
            false,
            'todos/toggle',
        ),
});

export const useTodosStore = create<TodosState>()(
    devtools(immer(initializer), {
        name: 'TodosStore',
        enabled: process.env.NODE_ENV === 'development',
    }),
);
```

Requires the `immer` package (not currently a dependency — add it if you use
this). Worth it once an update needs to reach two or three levels into nested
state; for flat state, a manual spread is just as readable and one less
dependency.

### `subscribeWithSelector` — subscribe without re-rendering

Lets code outside a React component subscribe to a _slice_ of a store and
react to it changing, without subscribing a component to the whole store.
Useful for imperative side effects — e.g. firing an analytics event or
syncing to `localStorage` by hand — that shouldn't be tied to a component's
render cycle.

```ts
import { subscribeWithSelector } from 'zustand/middleware';
import { useSidebarStore } from '@/store/useSidebarStore';

// Somewhere outside React — e.g. an app-init module.
const unsubscribe = useSidebarStore.subscribe(
    (state) => state.isOpen,
    (isOpen) => console.log('sidebar is now', isOpen ? 'open' : 'closed'),
);
```

To scope subscriptions to a selector like this, the store itself needs to be
created with the `subscribeWithSelector` middleware — without it, `.subscribe`
only supports subscribing to the entire state. Most stores don't need this;
reach for it when something _outside_ React (a WebSocket handler, a
non-React library integration) needs to react to state changes.

### `combine` — initial state + actions with inference

A minor type-inference convenience: instead of writing one interface covering
both state and actions, `combine` lets you pass the initial state object and
a function that returns the actions, and infers the combined type for you.

```ts
import { combine } from 'zustand/middleware';

const initializer = combine({ count: 0 }, (set) => ({
    increment: () =>
        set((s) => ({ count: s.count + 1 }), false, 'counter/increment'),
}));
```

Not essential — the explicit-interface style used everywhere else in
`src/store/` (see [`useSidebarStore`](../src/store/useSidebarStore.ts)) is
just as correct and arguably easier to read at a glance. Use `combine` if you
find yourself writing near-duplicate state/action shapes and want less
boilerplate, not as a default.

---

## Picking a middleware

| Need                                                        | Middleware                   |
| ----------------------------------------------------------- | ---------------------------- |
| State should survive a reload                               | `persist`                    |
| State is deeply nested and updates are getting hard to read | `immer`                      |
| Non-React code needs to react to a slice of state changing  | `subscribeWithSelector`      |
| Tired of writing state + actions as one interface           | `combine`                    |
| None of the above                                           | Just `createStore` — default |
