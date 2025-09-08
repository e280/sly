
import {AttrValue} from "../types.js"

export function applyAttrsMap(
		element: HTMLElement,
		attrs: Map<string, AttrValue>,
	) {

	for (const [key, value] of Object.entries(attrs)) {
		if (value === undefined)
			element.removeAttribute(key)

		else if (value === null)
			element.removeAttribute(key)

		else if (typeof value === "string")
			element.setAttribute(key, value)

		else if (typeof value === "number")
			element.setAttribute(key, value.toString())

		else if (typeof value === "boolean") {
			if (value === true)
				element.setAttribute(key, "")
			else
				element.removeAttribute(key)
		}

		else
			console.warn(`invalid attribute type ${key} is ${typeof value}`)
	}
}


export function applyAttrs(
		element: HTMLElement,
		attrs: Record<string, AttrValue>,
	) {

	for (const [key, value] of Object.entries(attrs)) {
		if (value === undefined)
			element.removeAttribute(key)

		else if (value === null)
			element.removeAttribute(key)

		else if (typeof value === "string")
			element.setAttribute(key, value)

		else if (typeof value === "number")
			element.setAttribute(key, value.toString())

		else if (typeof value === "boolean") {
			if (value === true)
				element.setAttribute(key, "")
			else
				element.removeAttribute(key)
		}

		else
			console.warn(`invalid attribute type ${key} is ${typeof value}`)
	}
}

