
export const $ = one

export type Queryable = HTMLElement | Document | ShadowRoot | Element

function all<E extends HTMLElement = HTMLElement>(selector: string, context: Queryable = document) {
	return Array.from(context.querySelectorAll<E>(selector))
}

function one<E extends HTMLElement = HTMLElement>(selector: string, context: Queryable = document) {
	const e = context.querySelector<E>(selector)
	if (!e) throw new Error(`$1 ${selector} not found`)
	return e
}

one.maybe = <E extends HTMLElement = HTMLElement>(selector: string, context: Queryable = document) => {
	return context.querySelector<E>(selector)
}

one.all = all

