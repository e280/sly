
export type Life<V> = [value: V, dispose: () => void]
export const asLife = <V>(life: Life<V>) => life
export const asLifeFn = <V>(fn: () => Life<V>) => fn

