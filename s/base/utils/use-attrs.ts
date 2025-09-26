
import {Use} from "../use.js"
import {dom} from "../../dom/dom.js"
import {Attrs, AttrSpec} from "../../dom/types.js"

export class UseAttrs {
	#use: Use
	#attrs: Attrs

	constructor(use: Use) {
		this.#use = use
		this.#attrs = dom.attrs(use.element)
	}

	get strings() { return this.#attrs.strings }
	get numbers() { return this.#attrs.numbers }
	get booleans() { return this.#attrs.booleans }

	spec<A extends AttrSpec>(spec: A) {
		return this.#use.once(() => this.#attrs.spec(spec))
	}

	on(fn: () => void) {
		return this.#use.mount(() => this.#attrs.on(fn))
	}
}

