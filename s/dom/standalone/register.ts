
import {dashify} from "./dashify.js"

type HTMLElementClasses = {
	[key: string]: {new(...args: any[]): HTMLElement}
}

/** register custom elements to the dom, with dashified names. */
export function register<E extends HTMLElementClasses>(elements: E, options: {

		/** true to do nothing if the element is already defined. otherwise, throw error. default false. */
		soft?: boolean

		/** true to run `customElements.upgrade` on already-placed elements. default true. */
		upgrade?: boolean

	} = {}) {

	const {soft = false, upgrade = true} = options

	for (const [name, Element] of Object.entries(elements)) {
		const tag = dashify(name)
		const already = customElements.get(tag)

		if (soft && already)
			continue

		customElements.define(tag, Element)

		if (upgrade)
			document.querySelectorAll(tag).forEach(element => {
				if (element.constructor === HTMLElement)
					customElements.upgrade(element)
			})
	}
}

