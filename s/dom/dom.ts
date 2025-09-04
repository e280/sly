
import {render} from "lit"
import {register} from "./register.js"
import {Content} from "../views/types.js"
import {Queryable, Renderable} from "./types.js"

export class Dom<C extends Queryable> {
	constructor(public element: C) {}

	in<E extends HTMLElement>(elementOrSelector: E | string) {
		return new Dom(
			typeof elementOrSelector === "string"
				? this.require<E>(elementOrSelector)
				: elementOrSelector
		)
	}

	require<E extends Element = HTMLElement>(selector: string) {
		const e = this.element.querySelector<E>(selector)
		if (!e) throw new Error(`$1 ${selector} not found`)
		return e
	}

	maybe<E extends Element = HTMLElement>(selector: string) {
		return this.element.querySelector<E>(selector)
	}

	all<E extends Element = HTMLElement>(selector: string) {
		return Array.from(this.element.querySelectorAll<E>(selector))
	}

	render(...content: Content[]) {
		return render(content, this.element as Renderable)
	}
}

export function dom(selector: string) {
	return new Dom(document).require(selector)
}

const doc = new Dom(document)
dom.register = register
dom.render = (container: Renderable, ...content: Content[]) => {
	return render(content, container)
}

dom.in = doc.in.bind(doc)
dom.require = doc.require.bind(doc)
dom.maybe = doc.maybe.bind(doc)
dom.all = doc.all.bind(doc)

