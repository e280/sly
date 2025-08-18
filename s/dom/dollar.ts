
import {render} from "lit"
import {register} from "./register.js"
import {Content} from "../views/types.js"

export type Container = HTMLElement | ShadowRoot | DocumentFragment
export type Queryable = HTMLElement | ShadowRoot | Element | Document | DocumentFragment

export function $<E extends HTMLElement = HTMLElement>(selector: string, context: Queryable = document) {
	const e = context.querySelector<E>(selector)
	if (!e) throw new Error(`$1 ${selector} not found`)
	return e
}

function all<E extends HTMLElement = HTMLElement>(selector: string, context: Queryable = document) {
	return Array.from(context.querySelectorAll<E>(selector))
}

$.maybe = <E extends HTMLElement = HTMLElement>(selector: string, context: Queryable = document) => {
	return context.querySelector<E>(selector)
}

$.all = all

$.render = (container: Container, ...content: Content[]) => render(content, container)
$.register = register

