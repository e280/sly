
import {render} from "lit"
import {AttrSpec} from "./types.js"
import {attrs} from "./attrs/attrs.js"
import {Content} from "../ui/types.js"
import {register} from "./parts/register.js"
import { eve, EveSpec } from "./parts/eve.js"

export type Renderable = HTMLElement | ShadowRoot | DocumentFragment
export type Queryable = HTMLElement | ShadowRoot | Element | Document | DocumentFragment

function require<E extends Element>(
		container: Queryable,
		selector: string,
	) {
	const e = container.querySelector<E>(selector)
	if (!e) throw new Error(`element not found (${selector})`)
	return e
}

export class Dom<C extends Queryable> {
	constructor(public element: C) {}

	in<E extends HTMLElement>(selectorOrElement: string | E) {
		return new Dom<E>(
			(typeof selectorOrElement === "string")
				? require(this.element, selectorOrElement) as E
				: selectorOrElement
		)
	}

	require<E extends Element = HTMLElement>(selector: string) {
		const e = this.element.querySelector<E>(selector)
		if (!e) throw new Error(`element not found (${selector})`)
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

	attrs() {
		return attrs(this.element as HTMLElement)
	}

	events(spec: EveSpec) {
		return eve(this.element, spec)
	}
}

export function dom<E extends Queryable>(selector: string): E
export function dom<E extends Queryable>(element: E): Dom<E>
export function dom<E extends Queryable>(selectorOrElement: string | E): E | Dom<E> {
	return (typeof selectorOrElement === "string")
		? require(document, selectorOrElement) as E
		: new Dom(selectorOrElement)
}

const doc = new Dom(document)
dom.in = doc.in.bind(doc)
dom.require = doc.require.bind(doc)
dom.maybe = doc.maybe.bind(doc)
dom.all = doc.all.bind(doc)

dom.events = eve
dom.attrs = attrs
dom.register = register
dom.render = (container: Renderable, ...content: Content[]) => {
	return render(content, container)
}

