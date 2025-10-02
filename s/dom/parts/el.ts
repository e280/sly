
import {AttrValue} from "../types.js"
import {attrSet} from "../attrs/parts/attr-fns.js"

export function el<E extends HTMLElement>(
		tagName: string,
		attrs: Record<string, AttrValue> = {},
	) {

	const element = document.createElement(tagName) as E
	attrSet.record(element, attrs)
	return element
}

