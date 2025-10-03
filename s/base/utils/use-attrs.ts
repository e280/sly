
import {Use} from "../use.js"
import {dom} from "../../dom/dom.js"
import {AttrSpec, AttrTypes} from "../../dom/types.js"

export type UseAttrs = {
	<A extends AttrSpec>(spec: A): AttrTypes<A>
	strings: Record<string, undefined | string>
	numbers: Record<string, undefined | number>
	booleans: Record<string, undefined | boolean>
	spec<A extends AttrSpec>(spec: A): AttrTypes<A>
	on(fn: () => void): void
}

export function useAttrs(use: Use): UseAttrs {
	const attrs = dom.attrs(use.element)

	function attrsFn<A extends AttrSpec>(spec: A) {
		return use.once(() => attrs.spec<A>(spec))
	}

	attrsFn.strings = attrs.strings
	attrsFn.numbers = attrs.numbers
	attrsFn.booleans = attrs.booleans

	attrsFn.spec = <A extends AttrSpec>(spec: A) => {
		return use.once(() => attrs.spec<A>(spec))
	}

	attrsFn.on = (fn: () => void) => {
		return use.mount(() => attrs.on(fn))
	}

	return attrsFn
}

