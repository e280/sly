
import {PrimitiveAttr, PrimitiveAttrs} from "../types.js"

export function applyAttrs(element: HTMLElement, attrs: PrimitiveAttrs) {
	for (const [name, value] of Object.entries(attrs))
		applyAttr(element, name, value)
}

function applyAttr(element: HTMLElement, name: string, value: PrimitiveAttr) {
	const existing = element.getAttribute(name)
	const v = coerce(value)
	if (v === existing) return
	if (v === null) element.removeAttribute(name)
	else element.setAttribute(name, v)
}

function coerce(value: PrimitiveAttr) {
	if (typeof value === "string") return value
	else if (typeof value === "number") return value.toString()
	return value ? "" : null
}

