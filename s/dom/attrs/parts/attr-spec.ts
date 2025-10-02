
import {attrGet, attrSet} from "./attr-fns.js"
import {AttrSpec, AttrTypes} from "../../types.js"

/** specify available html attributes and their types and create a proxy accessor */
export const attrSpec = <A extends AttrSpec>(
		e: HTMLElement,
		spec: A,
	) => new Proxy(spec, {

	get: (_target, key: string) => {
		switch (spec[key]) {
			case String: return attrGet.string(e, key)
			case Number: return attrGet.number(e, key)
			case Boolean: return attrGet.boolean(e, key)
			default: throw new Error(`invalid attribute type for "${key}"`)
		}
	},

	set: (_target, key: string, value: any) => {
		switch (spec[key]) {
			case String: return attrSet.string(e, key, value)
			case Number: return attrSet.number(e, key, value)
			case Boolean: return attrSet.boolean(e, key, value)
			default: throw new Error(`invalid attribute type for "${key}"`)
		}
	},
}) as any as AttrTypes<A>

