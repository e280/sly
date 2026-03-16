
import {AttrSpec} from "../types.js"
import {onAttrs} from "./parts/on-attrs.js"
import {AttrProxies} from "./parts/attr-proxies.js"
import {attrGet, attrSet} from "./parts/attr-fns.js"
import {attrSpec, AttrSpecOptions} from "./parts/attr-spec.js"

export function attrs(element: HTMLElement) {
	const proxies = new AttrProxies(element)
	return {
		strings: proxies.strings,
		numbers: proxies.numbers,
		booleans: proxies.booleans,
		on: (fn: MutationCallback) => onAttrs(element, fn),
		spec: <A extends AttrSpec>(spec: A, options: AttrSpecOptions = {}) => attrSpec(element, spec, options),
	}
}

attrs.get = attrGet
attrs.set = attrSet

