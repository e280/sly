
import {pub} from "@e280/stz"
import {signal} from "@e280/strata/signals"

import {pod} from "./pod.js"
import {Pod, PodSelect} from "./types.js"

export class Op<V> {
	static loading<V>() {
		return new this<V>()
	}

	static ready<V>(value: V) {
		const op = new this<V>()
		op.signal(["ready", value])
		return op
	}

	static error<V>(error: any) {
		const op = new this<V>()
		op.signal(["error", error])
		return op
	}

	static promise<V>(promise: Promise<V>) {
		const op = new this<V>()
		op.promise(promise)
		return op
	}

	static fn<V>(fn: () => Promise<V>) {
		return this.promise(fn())
	}

	readonly signal = signal<Pod<V>>(["loading"])
	#resolve = pub<[V]>()
	#reject = pub<[any]>()

	get wait() {
		return new Promise((resolve, reject) => {
			this.#resolve.next().then(resolve)
			this.#reject.next().then(reject)
		})
	}

	async setLoading() {
		await this.signal(["loading"])
	}

	async setReady(value: V) {
		await this.signal(["ready", value])
		await this.#resolve(value)
	}

	async setError(error: any) {
		await this.signal(["error", error])
		await this.#reject(error)
	}

	async promise(promise: Promise<V>) {
		await this.setLoading()
		try {
			const value = await promise
			await this.setReady(value)
			return value
		}
		catch (error) {
			await this.setError(error)
		}
	}

	async fn(fn: () => Promise<V>) {
		return this.promise(fn())
	}

	get pod() {
		return this.signal()
	}

	get status() {
		return this.signal()[0]
	}

	get value() {
		return pod.value(this.signal())
	}

	get error() {
		return pod.error(this.signal())
	}

	get isLoading() {
		return this.status === "loading"
	}

	get isReady() {
		return this.status === "ready"
	}

	get isError() {
		return this.status === "error"
	}

	require() {
		const pod = this.signal()
		if (pod[0] !== "ready") throw new Error("required value not ready")
		return pod[1]
	}

	select<R>(select: PodSelect<V, R>) {
		return pod.select(this.signal(), select)
	}
}

