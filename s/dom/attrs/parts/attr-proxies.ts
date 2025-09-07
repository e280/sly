
import {attrFns} from "./attr-fns.js"

/** a typed proxy accessor for html attributes */
export class AttrProxies {
	constructor(public element: HTMLElement) {}

	string = new Proxy({}, {
		get: (_t, key: string) => (
			attrFns.get.string(this.element, key)
		),
		set: (_t, key: string, value: string | undefined) => (
			attrFns.set.string(this.element, key, value)
		),
	}) as Record<string, string | undefined>

	number = new Proxy({}, {
		get: (_t, key: string) => (
			attrFns.get.number(this.element, key)
		),
		set: (_t, key: string, value: number | undefined) => (
			attrFns.set.number(this.element, key, value)
		),
	}) as Record<string, number | undefined>

	boolean = new Proxy({}, {
		get: (_t, key: string) => (
			attrFns.get.boolean(this.element, key)
		),
		set: (_t, key: string, value: boolean | undefined) => (
			attrFns.set.boolean(this.element, key, value)
		),
	}) as Record<string, boolean | undefined>
}

