import Utils from '../stuff/utils.js'
import Events from './events.js'
import SeClient from './se/seClient.js'
import DataView$ from './dataView.js'

class DataHub {
  /**
   * Creates a new DataHub instance
   * @param {string} nvId - Night Vision chart identifier
   */
  constructor(nvId) {
    let events = Events.instance(nvId)
    let se = SeClient.instance(nvId)
    this.events = events
    this.se = se
    se.hub = this // Set a ref to the hub

    // EVENT INTERFACE
    events.on('hub:set-scale-index', this.onScaleIndex.bind(this))
    events.on('hub:display-overlay', this.onDisplayOv.bind(this))
    events.on('hub:remove-overlay', this.onRemoveOv.bind(this))
  }

  /**
   * Initializes the DataHub with chart data
   * @param {Object} data - Chart data object
   * @param {boolean} [data.indexBased] - Flag indicating if data is index-based
   * @param {Array<Object>} [data.panes] - Array of chart panes
   */
  init(data) {
    // [API] All here are read-only

    // Data object
    this.data = data
    // Index based mode
    this.indexBased = data.indexBased ?? false

    this.chart = null // Pane with the main overlay (main pane)
    this.offchart = null // All other panes
    this.mainOv = null // Main overlay ref
    this.mainPaneId = null // Mane pane id
  }

  /**
   * Updates data views when chart range changes
   * Only applies filters without updating the full structure
   * @param {Array<number>} range - [start, end] indices of the visible range
   */
  updateRange(range) {
    for (var pane of this.data.panes) {
      for (var ov of pane.overlays) {
        let off = ov.indexOffset
        ov.dataView = this.filter(ov.data, range, off)
        ov.dataSubset = ov.dataView.makeSubset()
      }
    }
  }

  /**
   * Calculates visible data section and completes the main structure
   * Assigns IDs, creates necessary objects and prepares data subsets
   * @param {Array<number>} range - [start, end] indices of the visible range
   * @todo Implement smarter algorithm of adding/removing panes. Uuids should remain the same if pane still exists
   */
  calcSubset(range) {
    var paneId = 0
    for (var pane of this.data.panes || []) {
      pane.id = paneId++
      pane.overlays = pane.overlays || []
      pane.settings = pane.settings || {}
      var ovId = 0
      for (var ov of pane.overlays) {
        ov.id = ovId++
        ov.main = !!ov.main
        ov.data = ov.data || []
        ov.dataView = this.filter(ov.data, range, ov.indexOffset)
        ov.dataSubset = ov.dataView.makeSubset()
        ov.dataExt = ov.dataExt || {}
        ov.settings = ov.settings || {}
        ov.props = ov.props || {}
        ov.uuid = ov.uuid || Utils.uuid3()
      }
      // Flag that pane is ready for rendering
      pane.uuid = pane.uuid || Utils.uuid3()
    }
  }

  /**
   * Loads and prepares indicator scripts
   * @param {boolean} [exec=false] - If true, executes scripts after loading
   * @returns {Promise<void>} - Promise that resolves when scripts are loaded and executed
   */
  async loadScripts(exec = false) {
    for (var pane of this.data.panes || []) {
      var scriptId = 0
      pane.scripts = pane.scripts || []
      for (var s of pane.scripts) {
        s.id = scriptId++
        s.settings = s.settings || {}
        s.props = s.props || {}
        s.uuid = s.uuid || Utils.uuid3()
      }
    }
    if (exec) {
      await Utils.pause(0) // Wait for init
      await this.se.uploadAndExec()
    }
  }

  /**
   * Detects the main chart and defines offcharts
   * Sets this.chart, this.offchart, this.mainOv, and this.mainPaneId properties
   * @returns {void}
   * @todo Remove duplicate code here & in dataScanner
   */
  detectMain() {
    // TODO: remove duplicate code here & in dataScanner
    let all = Utils.allOverlays(this.data.panes)
    let mainOv = all.find((x) => x.main) || all[0]

    if (!all.length || !mainOv) return

    mainOv.main = true // If there is only one OV

    this.chart = this.data.panes.find((x) => x.overlays.find((y) => y.main))

    this.offchart = this.data.panes.filter((x) => x !== this.chart)

    this.mainOv = mainOv
    this.mainPaneId = this.panes().indexOf(this.chart)

    // Remove all 'main' overlays except the first
    for (var ov of all) {
      if (ov !== mainOv) ov.main = false
    }
  }

  /**
   * Creates a subset of timeseries based on the given range and offset
   * @param {Array<Object>} data - The source data array
   * @param {Array<number>} range - [start, end] indices of the visible range
   * @param {number} [offset=0] - Index offset to apply to the range
   * @returns {DataView$} - A DataView object containing the filtered data
   */
  filter(data, range, offset = 0) {
    let filter = this.indexBased ? Utils.fastFilterIB : Utils.fastFilter2
    var ix = filter(data, range[0] - offset, range[1] - offset)
    return new DataView$(data, ix[0], ix[1])
  }

  /**
   * Gets all active panes (those with uuid)
   * @returns {Array<Object>} - Array of active pane objects
   */
  panes() {
    return (this.data.panes || []).filter((x) => x.uuid)
  }

  /**
   * Gets overlay reference by paneId and overlayId
   * @param {number} paneId - Index of the pane
   * @param {number} ovId - Index of the overlay
   * @returns {Object|undefined} - Overlay object or undefined if not found
   */
  overlay(paneId, ovId) {
    return this.panes()[paneId]?.overlays[ovId]
  }

  /**
   * Gets overlay data by paneId and overlayId
   * @param {number} paneId - Index of the pane
   * @param {number} ovId - Index of the overlay
   * @returns {Array<Object>|undefined} - Overlay data array or undefined if not found
   */
  ovData(paneId, ovId) {
    return this.panes()[paneId]?.overlays[ovId]?.data
  }

  /**
   * Gets overlay extra data by paneId and overlayId
   * @param {number} paneId - Index of the pane
   * @param {number} ovId - Index of the overlay
   * @returns {Object|undefined} - Overlay extra data object or undefined if not found
   */
  ovDataExt(paneId, ovId) {
    return this.panes()[paneId]?.overlays[ovId]?.dataExt
  }

  /**
   * Gets overlay data subset by paneId and overlayId
   * @param {number} paneId - Index of the pane
   * @param {number} ovId - Index of the overlay
   * @returns {Array<Object>|undefined} - Overlay data subset array or undefined if not found
   */
  ovDataSubset(paneId, ovId) {
    return this.panes()[paneId]?.overlays[ovId]?.dataSubset
  }

  /**
   * Gets all overlays, optionally filtered by type
   * @param {string} [type] - Filter overlays by this type if provided
   * @returns {Array<Object>} - Array of overlay objects
   */
  allOverlays(type) {
    let all = Utils.allOverlays(this.data.panes)
    return type ? all.filter((x) => x.type === type) : all
  }

  // Event handlers

  /**
   * Handles scale index change events
   * @param {Object} event - The event object
   * @param {number} event.paneId - Index of the pane
   * @param {number} event.index - The new scale index
   * @param {Array<number>} event.sideIdxs - Left and right scale indices
   * @returns {void}
   */
  onScaleIndex(event) {
    let pane = this.panes()[event.paneId]
    if (!pane) return

    // Main scale index (that used for the grid)
    pane.settings.scaleIndex = event.index

    // Local left & right indices used to
    // display the correct Scale
    pane.settings.scaleSideIdxs = event.sideIdxs

    this.events.emitSpec('chart', 'update-layout')
  }

  /**
   * Handles overlay display toggling events
   * @param {Object} event - The event object
   * @param {number} event.paneId - Index of the pane
   * @param {number} event.ovId - Index of the overlay
   * @param {boolean} event.flag - Display state flag
   * @returns {void}
   */
  onDisplayOv(event) {
    let pane = this.panes()[event.paneId]
    if (!pane) return

    let ov = pane.overlays[event.ovId]
    if (!ov) return

    ov.settings.display = event.flag

    // Legend-line id
    let llId = `${event.paneId}-${event.ovId}`

    this.events.emitSpec('chart', 'update-layout')
    this.events.emitSpec(`ll-${llId}`, 'update-ll')
  }

  /**
   * Handles overlay removal events
   * @param {Object} event - The event object
   * @param {number} event.paneId - Index of the pane
   * @param {number} event.ovId - Index of the overlay
   * @returns {void}
   */
  onRemoveOv(event) {
    let pane = this.panes()[event.paneId]
    if (!pane) return

    let overlay = pane.overlays[event.ovId]
    if (!overlay || overlay.main) return // Don't remove the main overlay

    pane.overlays.splice(event.ovId, 1)

    if (pane.overlays.length === 0) {
      this.data.panes.splice(event.paneId, 1)
    }

    this.events.emitSpec('chart', 'update-layout')
  }
}

let instances = {}

/**
 * Factory function that creates or returns an existing DataHub instance
 * @param {string} id - Night Vision chart identifier
 * @returns {DataHub} - DataHub instance for the specified id
 */
function instance(id) {
  if (!instances[id]) {
    instances[id] = new DataHub(id)
  }
  return instances[id]
}

export default { instance }
