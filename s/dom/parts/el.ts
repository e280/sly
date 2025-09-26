
import {AttrValue} from "../../view/types.js"
import {setAttrs} from "../../view/utils/parts/set-attrs.js"

export function el<E extends HTMLElement>(
		tagName: string,
		attrs: Record<string, AttrValue>,
	) {

	const element = document.createElement(tagName) as E
	setAttrs(element, Object.entries(attrs))
	return element
}

