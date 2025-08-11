<script>
  // Legend control buttons

  import Events from '../core/events.js'
  import icons from '../assets/icons.json'

  export let gridId // gridId
  export let ov // Overlay
  export let props // General props
  export let height // Legend-line height

  let events = Events.instance(props.id)

  $:display = ov.settings.display !== false
  $:state = display ? 'open' : 'closed'

  $:eyeStyle = `
    background-image: url(${icons[state + '-eye']});
    background-size: contain;
    background-repeat: no-repeat;
    margin-top: ${(height - 20) * 0.5 - 3}px;
    /* FIX 'overflow: hidden' changes baseline */
    margin-bottom: -2px;
`

  $:closeStyle = `
    background-image: url(${icons.trash});
    background-size: contain;
    background-repeat: no-repeat;
    margin-top: ${(height - 20) * 0.5 - 3}px;
    /* FIX 'overflow: hidden' changes baseline */
    margin-bottom: -2px;
`

  $:settingStyle = `
    background-image: url(${icons.settings});
    background-size: contain;
    background-repeat: no-repeat;
    margin-top: ${(height - 20) * 0.5 - 3}px;
    /* FIX 'overflow: hidden' changes baseline */
    margin-bottom: -2px;
`

  export function update() {
    display = ov.settings.display !== false
  }

  function onDisplayClick() {
    events.emitSpec('hub', 'display-overlay', {
      paneId: gridId,
      ovId: ov.id,
      flag: ov.settings.display === undefined ?
        false : !ov.settings.display
    })
  }

  function onRemoveClick() {
    events.emitSpec('hub', 'remove-overlay', {
      paneId: gridId,
      ovId: ov.id
    })
    events.emitSpec('extern', 'remove-overlay', {
      paneId: gridId,
      ovId: ov.id
    })
  }

  function onSettingsClick() {
    events.emitSpec('extern', 'open-overlay-settings', {
      paneId: gridId,
      ovId: ov.id
    })
  }

</script>
<style>
    .nvjs-eye, .nvjs-close, .nvjs-settings {
        width: 20px;
        height: 20px;
        float: right;
        margin-right: 2px;
        margin-left: 7px;
    }

    .nvjs-eye:hover, .nvjs-close:hover, .nvjs-settings:hover {
        filter: brightness(1.25);
    }
</style>
{#if !ov.main}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="nvjs-close" style={closeStyle}
         on:click|stopPropagation={onRemoveClick}>
    </div>
{/if}

{#if ov.settings.customSettingsBtn}
    <div class="nvjs-settings" style={settingStyle}
         on:click|stopPropagation={onSettingsClick}>
    </div>
{/if}

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="nvjs-eye" style={eyeStyle}
     on:click|stopPropagation={onDisplayClick}>
</div>
