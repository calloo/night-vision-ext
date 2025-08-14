
# DataHub API

The API of [DataHub](/guide/main-comp/data-hub.html)

## dataHub.chart

- **Type:** `Pane`
- **Related:** [Pane Object](/guide/data-struct/pane-object)

A pane that contains the main overlay.

## dataHub.offchart

- **Type:** `Pane []`
- **Related:** [Pane Object](/guide/data-struct/pane-object)

An array of non-main panes.

## dataHub.mainOv

- **Type:** `Overlay`
- **Related:** [Overlay Object](/guide/data-struct/overlay-object)

The main overlay object.

## dataHub.mainPaneId

- **Type:** `number`
- **Related:** [Overlay Object](/guide/data-struct/overlay-object)

Id of the main pane.

## dataHub.panes()

- **Type:** `function`
- **Returns** `Pane []`
- **Related:** [Pane Object](/guide/data-struct/pane-object)

Returns all active panes of the chart.

## dataHub.overlay(paneId, ovId)

- **Type:** `function`
- **Arguments**
    - `paneId`: `number` Pane id
    - `ovId`: `number` Overlay id
- **Returns** `Overlay`
- **Related:** [Overlay Object](/guide/data-struct/overlay-object)

Returns an overlay by specific Pane id and Overlay id.

## dataHub.ovData(paneId, ovId)

- **Type:** `function`
- **Arguments**
    - `paneId`: `number` Pane id
    - `ovId`: `number` Overlay id
- **Returns** `Array`
- **Related:** [Overlay Object](/guide/data-struct/overlay-object)

Return the data of a specific overlay.

## dataHub.allOverlays()

- **Type:** `function`
- **Returns** `Overlay []`
- **Related:** [Overlay Object](/guide/data-struct/overlay-object)

Return all overlays (from all panes)

## dataHub.addIndicator(paneId, type, props)

- **Type:** `function`
- **Arguments**
    - `paneId`: `number` Pane id
    - `type`: `string` Type of the indicator
    - `props`: `object` Optional properties for the indicator
- **Returns** `Promise<number>` Index of the added indicator

Adds an indicator to a specified pane and returns the script id.

## dataHub.removeIndicator(paneId, scriptId)

- **Type:** `function`
- **Arguments**
    - `paneId`: `number` Pane id
    - `scriptId`: `number` Index of the script to remove
- **Returns** `Promise<void>`

Removes an indicator from a specified pane.
