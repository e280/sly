
import {attrGet, attrSet} from "./attr-fns.js"

/** a typed proxy accessor for html attributes */
export class AttrProxies {
	constructor(public element: HTMLElement) {}

	strings = new Proxy({}, {
		get: (_t, key: string) => (
			attrGet.string(this.element, key)
		),
		set: (_t, key: string, value: string | undefined) => (
			attrSet.string(this.element, key, value)
		),
	}) as Record<string, string | undefined>

	numbers = new Proxy({}, {
		get: (_t, key: string) => (
			attrGet.number(this.element, key)
		),
		set: (_t, key: string, value: number | undefined) => (
			attrSet.number(this.element, key, value)
		),
	}) as Record<string, number | undefined>

	booleans = new Proxy({}, {
		get: (_t, key: string) => (
			attrGet.boolean(this.element, key)
		),
		set: (_t, key: string, value: boolean | undefined) => (
			attrSet.boolean(this.element, key, value)
		),
	}) as Record<string, boolean | undefined>
}

