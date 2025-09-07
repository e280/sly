
import {AttrSpec, AttrTypes} from "../../types.js"
import {attrFns} from "./attr-fns.js"

/** specify available html attributes and their types and create a proxy accessor */
export const attrSpec = <A extends AttrSpec>(
		e: HTMLElement,
		spec: A,
	) => new Proxy(spec, {

	get: (_target, key: string) => {
		switch (spec[key]) {
			case String: return attrFns.get.string(e, key)
			case Number: return attrFns.get.number(e, key)
			case Boolean: return attrFns.get.boolean(e, key)
			default: throw new Error(`invalid attribute type for "${key}"`)
		}
	},

	set: (_target, key: string, value: any) => {
		switch (spec[key]) {
			case String: return attrFns.set.string(e, key, value)
			case Number: return attrFns.set.number(e, key, value)
			case Boolean: return attrFns.set.boolean(e, key, value)
			default: throw new Error(`invalid attribute type for "${key}"`)
		}
	},
}) as any as AttrTypes<A>

