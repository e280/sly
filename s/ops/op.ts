
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

	static load<V>(fn: () => Promise<V>) {
		return this.promise(fn())
	}

	static all<V>(...ops: Op<V>[]) {
		const pods = ops.map(op => op.pod)
		return podium.all(...pods)
	}

	readonly signal: Signal<Pod<V>>
	#count = 0
	#resolve = pub<[V]>()
	#reject = pub<[any]>()

	constructor(pod: Pod<V> = ["loading"]) {
		this.signal = signal<Pod<V>>(pod)
	}

	get wait() {
		return new Promise<V>((resolve, reject) => {
			this.#resolve.next().then(([v]) => resolve(v))
			this.#reject.next().then(([e]) => reject(e))
		})
	}

	get then() { return this.wait.then.bind(this.wait) }
	get catch() { return this.wait.catch.bind(this.wait) }
	get finally() { return this.wait.finally.bind(this.wait) }

	async setLoading() {
		await this.signal.set(["loading"])
	}

	async setReady(value: V) {
		await this.signal.set(["ready", value])
		await this.#resolve(value)
	}

	async setError(error: any) {
		await this.signal.set(["error", error])
		await this.#reject(error)
	}

	async promise(promise: Promise<V>) {
		const count = ++this.#count
		await this.setLoading()
		try {
			const value = await promise
			if (count === this.#count)
				await this.setReady(value)
			return value
		}
		catch (error) {
			if (count === this.#count)
				await this.setError(error)
		}
	}

	async load(fn: () => Promise<V>) {
		return this.promise(fn())
	}

	get pod() {
		return this.signal.get()
	}

	set pod(p: Pod<V>) {
		this.signal.set(p)
	}

	get status() {
		return this.signal.get()[0]
	}

	get value() {
		return podium.value(this.signal.get())
	}

	get error() {
		return podium.error(this.signal.get())
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
		const pod = this.signal.get()
		if (pod[0] !== "ready") throw new Error("required value not ready")
		return pod[1]
	}

	select<R>(select: PodSelect<V, R>) {
		return podium.select(this.signal.get(), select)
	}

	morph<V2>(fn: (value: V) => V2) {
		return podium.morph(this.pod, fn)
	}
}

