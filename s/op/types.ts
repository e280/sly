
export type PodLoading = [status: "loading"]
export type PodReady<V> = [status: "ready", value: V]
export type PodError = [status: "error", error: any]
export type Pod<V> = PodLoading | PodReady<V> | PodError

export type PodSelect<V, R> = {
	loading: () => R
	ready: (value: V) => R
	error: (error: any) => R
}

