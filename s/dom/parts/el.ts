
import {AttrValue} from "../../ui/types.js"
import {setAttrs} from "../../ui/view/parts/set-attrs.js"

export function el<E extends HTMLElement>(
		tagName: string,
		attrs: Record<string, AttrValue>,
	) {

	const element = document.createElement(tagName) as E
	setAttrs(element, Object.entries(attrs))
	return element
}

