
import {dom} from "../../dom/dom.js"

export class SlyShadow extends HTMLElement {
	static register() {
		dom.register({SlyShadow}, {soft: true})
	}

	connectedCallback() {
		if (!this.hasAttribute("view"))
			this.setAttribute("view", "")
	}
}

