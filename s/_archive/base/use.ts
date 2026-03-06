
import {CSSResultGroup} from "lit"
import {defer, GMap} from "@e280/stz"
import {signal, SignalOptions} from "@e280/strata/signals"

import {Op} from "../ops/op.js"
import {Mounts} from "./utils/mounts.js"
import {States} from "./utils/states.js"
import {eve, EveSpec} from "../dom/parts/eve.js"
import {applyStyles} from "./utils/apply-styles.js"
import {useAttrs, UseAttrs} from "./utils/use-attrs.js"

export const _wrap = Symbol()
export const _disconnect = Symbol()
export const _reconnect = Symbol()

export class Use {
	readonly attrs: UseAttrs

	#runs = 0
	#position = 0
	#values = new GMap<number, any>()
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
		this.attrs = useAttrs(this)
	}

	/** number of times this view has been rendered */
	get renderCount() {
		return this.#runs
	}

	/** promise that resolves when this view next renders */
	get rendered() {
		return this.#rendered.promise
	}

	/** set the 'name' html attribute on the host element */
	name(name: string) {
		this.once(() => this.element.setAttribute("view", name))
	}

	/** attach stylesheets into the view's shadow dom */
	styles(...styles: CSSResultGroup[]) {
		this.once(() => applyStyles(this.shadow, styles))
	}
	
	/** attach stylesheets into the view's shadow dom (alias for 'styles') */
	css(...styles: CSSResultGroup[]) {
		return this.styles(...styles)
	}

	/** run a fn at initialization, and return a value */
	once<V>(fn: () => V) {
		return this.#values.guarantee(this.#position++, fn) as V
	}

	/** setup a mount/unmount lifecycle (your mount fn returns an unmount fn) */
	mount(fn: () => () => void) {
		return this.once(() => this.#mounts.mount(fn))
	}

	/** run fn each time mounted, return a value */
	wake<V>(fn: () => V) {
		return this.life(() => [fn(), () => {}])
	}

	/** mount/unmount lifecycle, but also return a value */
	life<V>(fn: () => [value: V, dispose: () => void]) {
		const box = this.once(() => ({value: undefined as V}))
		this.mount(() => {
			const [value, dispose] = fn()
			box.value = value
			return dispose
		})
		return box.value
	}

	/** attach event listeners on mount (they get cleaned up on unmount) */
	events(spec: EveSpec) {
		return this.mount(() => eve(this.element, spec))
	}

	/** helper for setting up internal states (its a dom api, look up `ElementInternals: states`) */
	states<S extends string = string>() {
		return this.once(() => new States<S>(this.element))
	}

	/** setup typed html attribute access */
	op = (() => {
		const that = this
		function op<V>(f: () => Promise<V>) {
			return that.once(() => Op.load(f))
		}
		op.load = op as (<V>(f: () => Promise<V>) => Op<V>)
		op.promise = <V>(p: Promise<V>) => this.once(() => Op.promise(p))
		return op
	})()

	/** use a strata signal */
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

	/** use a derived strata signal */
	derived<V>(formula: () => V, options?: Partial<SignalOptions>) {
		return this.once(() => signal.derived<V>(formula, options))
	}

	/** use a lazy strata signal */
	lazy<V>(formula: () => V, options?: Partial<SignalOptions>) {
		return this.once(() => signal.lazy<V>(formula, options))
	}
}

