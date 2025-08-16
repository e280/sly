
import {defer} from "@e280/stz"
import {signal} from "@e280/strata/signals"

export type PodLoading = [status: "loading"]
export type PodReady<V> = [status: "ready", value: V]
export type PodError = [status: "error", error: any]
export type Pod<V> = PodLoading | PodReady<V> | PodError

export class Op<V> {
	readonly signal = signal<Pod<V>>(["loading"])
	#deferred = defer<V>()

	async setLoading() {
		this.#deferred = defer()
		await this.signal(["loading"])
	}

	async setReady(value: V) {
		await this.signal(["ready", value])
		this.#deferred.resolve(value)
	}

	async setError(error: any) {
		await this.signal(["error", error])
		this.#deferred.reject(error)
	}

	async promise(promise: Promise<V>) {
		await this.setLoading()
		await promise
			.then(value => this.setReady(value))
			.catch(error => this.setError(error))
		return this.value as V
	}

	async fn(fn: () => Promise<V>) {
		return this.promise(fn())
	}

	get status() {
		return this.signal()[0]
	}

	get value() {
		const pod = this.signal()
		return pod[0] === "ready"
			? pod[1]
			: undefined
	}

	require() {
		const pod = this.signal()
		if (pod[0] !== "ready") throw new Error("required op value not ready")
		return pod[1]
	}

	select<R>(select: {
			loading: () => R
			ready: (value: V) => R
			error: (error: any) => R
		}) {
		const pod = this.signal()
		switch (pod[0]) {
			case "loading": return select.loading()
			case "error": return select.error(pod[1])
			case "ready": return select.ready(pod[1])
			default: throw new Error("unknown op status")
		}
	}
}

