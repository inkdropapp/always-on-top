import { getEnv } from './env'

let alwaysOnTop = false
const listeners = new Set<() => void>()

/**
 * Subscribes to always-on-top changes.
 *
 * Shaped for React's `useSyncExternalStore`.
 *
 * @param listener - Called after every state change
 * @returns An unsubscribe function
 */
export function subscribeToAlwaysOnTop(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getAlwaysOnTop(): boolean {
  return alwaysOnTop
}

function publish(next: boolean): void {
  if (next === alwaysOnTop) return
  alwaysOnTop = next
  for (const listener of listeners) listener()
}

/**
 * Applies the flag to the browser window, then publishes it to subscribers.
 *
 * The window owns the real flag, so the local state is only updated once the
 * IPC call resolves — a rejected call leaves subscribers showing reality.
 *
 * @param next - Whether the window should float above other windows
 * @throws When the window rejects the change
 */
export async function setAlwaysOnTop(next: boolean): Promise<void> {
  await getEnv().window.setAlwaysOnTop(next)
  publish(next)
}

/**
 * @throws When the window rejects the change
 */
export async function toggleAlwaysOnTop(): Promise<void> {
  await setAlwaysOnTop(!alwaysOnTop)
}

/**
 * Seeds the local state from the window, which is the source of truth.
 *
 * @throws When the window state cannot be read
 */
export async function syncAlwaysOnTopFromWindow(): Promise<void> {
  publish(await getEnv().window.isAlwaysOnTop())
}
