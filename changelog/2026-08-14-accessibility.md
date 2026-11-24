---
title: 'Accessibility fixes across the library'
type: fix
components:
    [
        alert,
        attachment,
        badge,
        breadcrumb,
        bubble,
        button,
        calendar,
        checkbox,
        collapsible,
        combo-box,
        command,
        data-table,
        dnd,
        dropdown-menu,
        field,
        item,
        label,
        multi-combo-box,
        radio-group,
        select,
        slider,
        switch,
        toggle,
    ]
---

Fixed every WCAG violation found by automated checks (130 across 35 files), mostly color contrast on soft and chip-style variants, plus missing labels and roles. Every component story is now checked in CI.
