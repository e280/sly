
import {dom} from "../../dom/dom.js"

/** <sly-view> element that views are rendered into. */
export class SlyView extends HTMLElement {
	static #already = false
	static register() {
		if (!this.#already) {
			dom.register({SlyView}, {soft: true, upgrade: true})
			this.#already = true
		}
	}
	static make() {
		this.register()
		return document.createElement("sly-view") as SlyView
	}
}

