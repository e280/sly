
import {dom} from "../../dom/dom.js"

export class SlyView extends HTMLElement {
	static #already = false
	static register() {
		if (!this.#already) {
			dom.register({SlyView}, {soft: true, upgrade: true})
			this.#already = true
		}
	}
}

