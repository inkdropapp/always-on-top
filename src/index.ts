import type { Environment, IInkdropPlugin } from '@inkdropapp/types'

import { AlwaysOnTopButton } from './always-on-top-button'
import {
  getAlwaysOnTop,
  setAlwaysOnTop,
  syncAlwaysOnTopFromWindow,
  toggleAlwaysOnTop
} from './always-on-top-state'
import { setEnv } from './env'

const COMPONENT_NAME = 'AlwaysOnTopButton'
const LAYOUT_NAME = 'editor-header'

/**
 * Reports a failed window call. `inkdrop.window` exposes the always-on-top
 * methods over IPC, so the call rejects outright on a build that predates them.
 */
function notifyFailure(app: Environment, message: string) {
  return (error: unknown) => {
    app.notifications.addError(message, {
      detail: error instanceof Error ? error.message : String(error),
      dismissable: true
    })
  }
}

class AlwaysOnTopPlugin implements IInkdropPlugin {
  private toggleCommand: { dispose(): void } | null = null

  activate(app: Environment) {
    setEnv(app)

    this.toggleCommand = app.commands.add(document.body, {
      'always-on-top:toggle': () => {
        toggleAlwaysOnTop().catch(notifyFailure(app, 'Failed to toggle always on top'))
      }
    })

    app.components.registerClass(AlwaysOnTopButton, COMPONENT_NAME)
    app.layouts.insertComponentToLayoutBefore(LAYOUT_NAME, 'EditorHeaderMore', COMPONENT_NAME)

    syncAlwaysOnTopFromWindow().catch(notifyFailure(app, 'Failed to read the always on top state'))
  }

  async deactivate(app: Environment) {
    app.layouts.removeComponentFromLayout(LAYOUT_NAME, COMPONENT_NAME)
    app.components.deleteClass(AlwaysOnTopButton, COMPONENT_NAME)
    this.toggleCommand?.dispose()
    this.toggleCommand = null

    try {
      if (getAlwaysOnTop()) await setAlwaysOnTop(false)
    } finally {
      setEnv(undefined)
    }
  }
}

export default new AlwaysOnTopPlugin()
