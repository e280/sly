
import {attrs} from "./attrs/attrs.js"

export type Renderable = HTMLElement | ShadowRoot | DocumentFragment
export type Queryable = HTMLElement | ShadowRoot | Element | Document | DocumentFragment

// attrs

export type AttrKind = (
	| typeof String
	| typeof Number
	| typeof Boolean
)

export type AttrType<H extends AttrKind> = (
	H extends typeof String
		? string | undefined

	: H extends typeof Number
		? number | undefined

	: H extends typeof Boolean
		? boolean

	: never
)

export type AttrSpec = {
	[key: string]: AttrKind
}

export type AttrTypes<A extends AttrSpec> = {
	[P in keyof A]: AttrType<A[P]>
}

export type Attrs = ReturnType<typeof attrs>

// register

export type HTMLElementClasses = {
	[key: string]: {new(...args: any[]): HTMLElement}
}

export type RegisterOptions = {
	soft: boolean
	upgrade: boolean
}

