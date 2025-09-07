
import {AttrSpec} from "../types.js"
import {onAttrs} from "./parts/on-attrs.js"
import {attrFns} from "./parts/attr-fns.js"
import {attrSpec} from "./parts/attr-spec.js"
import {AttrProxies} from "./parts/attr-proxies.js"

export function attrs(element: HTMLElement) {
	const proxies = new AttrProxies(element)
	return {
		string: proxies.string,
		number: proxies.number,
		boolean: proxies.boolean,
		on: (fn: () => void) => onAttrs(element, fn),
		spec: <A extends AttrSpec>(spec: A) => attrSpec(element, spec),
	}
}

attrs.get = attrFns.get
attrs.set = attrFns.set

