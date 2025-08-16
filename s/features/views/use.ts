
import {CSSResultGroup} from "lit"
import {defer, MapG} from "@e280/stz"
import {signal} from "@e280/strata/signals"

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
	) {}

	get renderCount() {
		return this.#runs
	}

	get rendered() {
		return this.#rendered.promise
	}

	once<V>(fn: () => V) {
		return this.#values.guarantee(this.#position++, fn) as V
	}

	styles(...styles: CSSResultGroup[]) {
		this.once(() => applyStyles(this.shadow, styles))
	}

	name(name: string) {
		this.once(() => this.element.setAttribute("view", name))
	}

	signal<V>(value: V) {
		return this.once(() => signal<V>(value))
	}

	mount(mount: () => () => void) {
		return this.once(() => this.#mounts.mount(mount))
	}
}

