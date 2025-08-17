
import {pub} from "@e280/stz"
import {Signal, signal} from "@e280/strata/signals"

import {podium} from "./podium.js"
import {Pod, PodSelect} from "./types.js"

export class Op<V> {
	static loading<V>() { return new this<V>() }
	static ready<V>(value: V) { return new this<V>(["ready", value]) }
	static error<V>(error: any) { return new this<V>(["error", error]) }

	static promise<V>(promise: Promise<V>) {
		const op = new this<V>()
		op.promise(promise)
		return op
	}

	static fn<V>(fn: () => Promise<V>) {
		return this.promise(fn())
	}

	static all<V>(...ops: Op<V>[]) {
		const pods = ops.map(op => op.pod)
		const pod = podium.all(...pods)
		return new this(pod)
	}

	readonly signal: Signal<Pod<V>>
	#resolve = pub<[V]>()
	#reject = pub<[any]>()

	constructor(pod: Pod<V> = ["loading"]) {
		this.signal = signal<Pod<V>>(pod)
	}

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

	set pod(p: Pod<V>) {
		this.signal(p)
	}

	get status() {
		return this.signal()[0]
	}

	get value() {
		return podium.value(this.signal())
	}

	get error() {
		return podium.error(this.signal())
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
		return podium.select(this.signal(), select)
	}

	morph<V2>(fn: (value: V) => V2) {
		return new Op(podium.morph(this.pod, fn))
	}
}

