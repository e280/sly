
import {render} from "lit"
import {register} from "./register.js"
import {Content} from "../views/types.js"
import {Queryable, Renderable} from "./types.js"

function require<E extends Element>(
		container: Queryable,
		selector: string,
	) {
	const e = container.querySelector<E>(selector)
	if (!e) throw new Error(`element not found (${selector})`)
	return e
}

function resolve<E extends Queryable>(
		container: Queryable,
		elementOrSelector: E | string,
	) {
	return (typeof elementOrSelector === "string")
		? require(container, elementOrSelector) as E
		: elementOrSelector
}

export class Dom<C extends Queryable> {
	constructor(public element: C) {}

	in<E extends HTMLElement>(selector: string) {
		return new Dom<E>(this.require(selector))
	}

	require<E extends Element = HTMLElement>(selector: string) {
		return require<E>(this.element, selector)
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

export function dom<E extends Queryable>(elementOrSelector: E | string) {
	return new Dom(resolve(document, elementOrSelector))
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

