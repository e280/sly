
import {CSSResultGroup} from "lit"
import {defer, MapG} from "@e280/stz"
import {signal} from "@e280/strata/signals"

import {Op} from "../op/op.js"
import {Mounts} from "./utils/mounts.js"
import {applyStyles} from "./utils/apply-styles.js"

export const _wrap = Symbol()
export const _disconnect = Symbol()
export const _reconnect = Symbol()

export class Use {
	#runs = 0
	#position = 0
	#values = new MapG<number, any>()
	#rendered = defer()
	#mounts = new Mounts()

	;[_wrap](fn: () => void) {
		this.#runs++
		this.#position = 0
		this.#rendered = defer()
		fn()
		this.#rendered.resolve()
	}

	;[_disconnect]() {
		this.#mounts.unmountAll()
	}

	;[_reconnect]() {
		this.#mounts.remountAll()
	}

	constructor(
		public element: HTMLElement,
		public shadow: ShadowRoot,
		public render: () => void,
	) {}

	get renderCount() {
		return this.#runs
	}

	get rendered() {
		return this.#rendered.promise
	}

	name(name: string) {
		this.once(() => this.element.setAttribute("view", name))
	}

	styles(...styles: CSSResultGroup[]) {
		this.once(() => applyStyles(this.shadow, styles))
	}

	once<V>(fn: () => V) {
		return this.#values.guarantee(this.#position++, fn) as V
	}

	mount(fn: () => () => void) {
		return this.once(() => this.#mounts.mount(fn))
	}

	life<V>(fn: () => [result: V, dispose: () => void]) {
		let r: V | undefined
		this.mount(() => {
			const [result, dispose] = fn()
			r = result
			return dispose
		})
		return r as V
	}

	op = {
		fn: <V>(f: () => Promise<V>) => this.once(() => Op.fn(f)),
		promise: <V>(p: Promise<V>) => this.once(() => Op.promise(p)),
	}

	signal<V>(value: V) {
		return this.once(() => signal<V>(value))
	}
}

