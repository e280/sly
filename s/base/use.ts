
import {CSSResultGroup} from "lit"
import {defer, MapG} from "@e280/stz"
import {signal, SignalOptions} from "@e280/strata/signals"

import {Op} from "../ops/op.js"
import {dom} from "../dom/dom.js"
import {Attrs} from "../dom/types.js"
import {Mounts} from "./utils/mounts.js"
import {applyStyles} from "./utils/apply-styles.js"

export const _wrap = Symbol()
export const _disconnect = Symbol()
export const _reconnect = Symbol()

export class Use {
	attrs: Attrs

	#runs = 0
	#position = 0
	#values = new MapG<number, any>()
	#rendered = defer()
	#mounts = new Mounts()

	;[_wrap]<R>(fn: () => R) {
		this.#runs++
		this.#position = 0
		this.#rendered = defer()
		const result = fn()
		this.#rendered.resolve()
		return result
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
			public renderNow: () => void,
			public render: () => Promise<void>,
		) {
		this.attrs = dom.attrs(this.element)
	}

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
	
	/** alias for 'styles' */
	css(...styles: CSSResultGroup[]) {
		return this.styles(...styles)
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

	wake<V>(fn: () => V) {
		return this.life(() => [fn(), () => {}])
	}

	op = (() => {
		const that = this
		function op<V>(f: () => Promise<V>) {
			return that.once(() => Op.load(f))
		}
		op.load = op as (<V>(f: () => Promise<V>) => Op<V>)
		op.promise = <V>(p: Promise<V>) => this.once(() => Op.promise(p))
		return op
	})()

	signal = (() => {
		const that = this
		function sig<V>(value: V, options?: Partial<SignalOptions>) {
			return that.once(() => signal<V>(value, options))
		}
		sig.derived = function derived<V>(formula: () => V, options?: Partial<SignalOptions>) {
			return that.once(() => signal.derived<V>(formula, options))
		}
		sig.lazy = function lazy<V>(formula: () => V, options?: Partial<SignalOptions>) {
			return that.once(() => signal.lazy<V>(formula, options))
		}
		return sig
	})()

	derived<V>(formula: () => V, options?: Partial<SignalOptions>) {
		return this.once(() => signal.derived<V>(formula, options))
	}

	lazy<V>(formula: () => V, options?: Partial<SignalOptions>) {
		return this.once(() => signal.lazy<V>(formula, options))
	}
}

