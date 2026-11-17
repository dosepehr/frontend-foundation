import type { Ref } from 'react';

/** Sets a callback or object ref to `node`; does nothing without a ref. */
export function assignRef<T>(ref: Ref<T> | undefined, node: T | null) {
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
}
