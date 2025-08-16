
import {defer, MapG} from "@e280/stz"
import {CSSResultGroup} from "lit"
import {signal} from "@e280/strata"
import {applyStyles} from "./utils/apply-styles.js"

export const _before = Symbol()
export const _after = Symbol()

export class Use {
	#runs = 0
	#position = 0
	#values = new MapG<number, any>()
	#rendered = defer()

	;[_before]() {
		this.#runs++
		this.#position = 0
		this.#rendered = defer()
	}

	;[_after]() {
		this.#rendered.resolve()
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
}

