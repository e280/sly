
import {dom} from "../../../dom/dom.js"

/** <sly-view> element that views are rendered into. */
export class SlyView extends HTMLElement {
	static #registered = false
	static make() {
		if (!this.#registered) {
			dom.register({SlyView}, {soft: true, upgrade: true})
			this.#registered = true
		}
		return document.createElement("sly-view") as SlyView
	}
}

