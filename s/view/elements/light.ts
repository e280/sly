
import {render} from "lit"
import {light} from "../light.js"
import {Content} from "../types.js"

export function lightElement(view: () => Content) {
	const fn = light(view)

	return class extends HTMLElement {
		connectedCallback() { render(fn(), this) }
		disconnectedCallback() { render(null, this) }
	}
}

