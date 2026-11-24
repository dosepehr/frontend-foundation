---
title: Changelog Entries
app: global
document_type: guide
author: dosepehr
created_at: 2026-11-24
updated_at: 2026-11-24
reviewed_at: null
status: active
version: 1.0
---

# Changelog entries

The [changelog page](https://dosepehr.github.io/docs/changelog) on the docs
site, and the **History** section of each component page, are built from the
files in [`changelog/`](../changelog). Commits are never published on their
own: a change appears only when it has an entry file, with the text you wrote
for it.

## Adding an entry

Create `changelog/YYYY-MM-DD-<slug>.md`. The date in the file name is the
entry's date; the slug is any lowercase, hyphenated name.

```md
---
title: 'Number Input and Price Input'
type: feature
components: [number-input, price-input]
---

**Number Input** with thousand separators, decimals, min and max, and an
optional stepper, and **Price Input**, which writes the amount out in words.
```

| Field        | Required | Meaning                                                                                |
| ------------ | -------- | -------------------------------------------------------------------------------------- |
| `title`      | yes      | One line, shown in bold next to the type.                                              |
| `type`       | yes      | `feature` (shown as "New"), `improvement` ("Improved"), `fix` ("Fixed") or `breaking`. |
| `components` | no       | Docs page slugs (kebab-case folder names, e.g. `combo-box`, `controlled-date-picker`). |

- **Components** link the entry to those pages and add it to their History
  section. Leave the field out for changes that aren't about one component
  (the registry, data fetching, PWA).
- **Body** (optional) is Markdown, rendered as MDX: bold, `code`, links and
  lists work. Write `<` and `{` inside backticks or escape them (`\<`, `\{`),
  and don't use headings — the page's table of contents lists months only.
- One entry can cover several commits (a component plus its fixes on the same
  day). Leave out changes users don't see: tests, stories, tooling, refactors
  that keep the API.
- For a breaking change, say what changed and what users need to do.

## How it gets published

The docs site ([dosepehr.github.io](https://github.com/dosepehr/dosepehr.github.io))
copies `changelog/` together with `src/` and generates the pages at build
time (`scripts/generate/changelog.mjs` there). The build fails with the file
name when an entry has a bad file name, a missing title, an unknown `type` or
a component slug that has no docs page.

Pushing to `main` deploys the registry, and
[`deploy-registry.yml`](../.github/workflows/deploy-registry.yml) then asks
the docs site to rebuild (see [registry.md](registry.md)). Without that
token the site still picks up new entries on its daily rebuild.

To preview locally, run `npm run dev` in a `dosepehr.github.io` checkout next
to this repo: it watches `changelog/` and regenerates on every save.
