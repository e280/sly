
import {AttrValue} from "../types.js"
import {attrSet} from "../attrs/parts/attr-fns.js"

export function elmer<E extends HTMLElement = HTMLElement>(tagName: string) {
	return new Elmer<E>(tagName)
}

export class Elmer<E extends HTMLElement = HTMLElement> {
	#attrs = new Map<string, AttrValue>()
	#children: (Node | string)[] = []

	constructor(public tagName: string) {}

	attr(key: string, value: AttrValue = true) {
		this.#attrs.set(key, value)
		return this
	}

	attrs(record: Record<string, AttrValue>) {
		for (const [key, value] of Object.entries(record))
			this.attr(key, value)
		return this
	}

	children(...elements: (Node | string)[]) {
		this.#children.push(...elements)
		return this
	}

	done() {
		const element = document.createElement(this.tagName)
		attrSet.entries(element, this.#attrs)
		element.append(...this.#children)
		return element as E
	}
}

