---
title: 'Renamed components and registry items'
type: breaking
components: [asterisk, separator, controlled-combo-box, direction]
---

Misspelled names are fixed: `Asteriks` is now **Asterisk**, and the `Seperator`, `ControlledCombobox` and `direction` folders are now `Separator`, `ControlledComboBox` and `Direction`. The registry items `asteriks`, `seperator` and `controlled-combobox` are now `asterisk`, `separator` and `controlled-combo-box`.

Hooks, providers, utilities and component type files also install to new paths, so reinstalling an item you added earlier creates a second copy. Delete the old file after reinstalling.
