
import {AttrSpec} from "../types.js"
import {onAttrs} from "./parts/on-attrs.js"
import {attrSpec} from "./parts/attr-spec.js"
import {AttrProxies} from "./parts/attr-proxies.js"
import {attrGet, attrSet} from "./parts/attr-fns.js"

export function attrs(element: HTMLElement) {
	const proxies = new AttrProxies(element)
	return {
		strings: proxies.strings,
		numbers: proxies.numbers,
		booleans: proxies.booleans,
		on: (fn: () => void) => onAttrs(element, fn),
		spec: <A extends AttrSpec>(spec: A) => attrSpec(element, spec),
	}
}

attrs.get = attrGet
attrs.set = attrSet

