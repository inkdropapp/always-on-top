import { useSyncExternalStore } from 'react'

import { AlwaysOnTopIcon } from './always-on-top-icon'
import { getAlwaysOnTop, subscribeToAlwaysOnTop } from './always-on-top-state'
import { getEnv } from './env'

const TITLE = 'Toggle Always On Top'

export const AlwaysOnTopButton = () => {
  const env = getEnv()
  const alwaysOnTop = useSyncExternalStore(subscribeToAlwaysOnTop, getAlwaysOnTop)
  const AppHeaderButton = env.components.getComponentClass('AppHeaderButton')
  if (!AppHeaderButton) return null

  return (
    <AppHeaderButton
      title={TITLE}
      command="always-on-top:toggle"
      className={'icon ' + (alwaysOnTop ? 'always-on-top-button active' : 'always-on-top-button')}
    >
      <AlwaysOnTopIcon title={TITLE} titleId="always-on-top-icon" />
    </AppHeaderButton>
  )
}
