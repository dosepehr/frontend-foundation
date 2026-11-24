---
title: 'Search matches Persian and Arabic digits'
type: improvement
components:
    [
        command,
        combo-box,
        multi-combo-box,
        tree-select,
        search-input,
        filter-input,
        data-filter,
    ]
---

Persian and Arabic-Indic digits typed into a search are matched as Latin digits, so "34" finds "Room ۳۴". Opt out with `normalizeDigits={false}` on `CommandInput`.
