
import {AttrValue} from "../../types.js"

/** get html attributes */
export const attrGet = {
	string: (e: HTMLElement, key: string) => {
		return e.getAttribute(key) ?? undefined
	},
	number: (e: HTMLElement, key: string) => {
		const raw = e.getAttribute(key)
		return (raw === null || !raw)
			? undefined
			: Number(raw)
	},
	boolean: (e: HTMLElement, key: string) => {
		const raw = e.getAttribute(key)
		return raw !== null
	},
}

/** set html attributes */
export const attrSet = {
	string: (e: HTMLElement, key: string, value: string | undefined) => {
		if (value === undefined) e.removeAttribute(key)
		else e.setAttribute(key, value)
		return true
	},
	number: (e: HTMLElement, key: string, value: number | undefined) => {
		if (value === undefined) e.removeAttribute(key)
		else e.setAttribute(key, value.toString())
		return true
	},
	boolean: (e: HTMLElement, key: string, value: boolean | undefined) => {
		if (value) e.setAttribute(key, "")
		else e.removeAttribute(key)
		return true
	},

	any: (element: HTMLElement, key: string, value: AttrValue) => {
		if (value === undefined || value === null)
			element.removeAttribute(key)

		else if (typeof value === "string")
			element.setAttribute(key, value)

		else if (typeof value === "number")
			element.setAttribute(key, value.toString())

		else if (typeof value === "boolean") {
			if (value === true)
				element.setAttribute(key, "")
			else
				element.removeAttribute(key)
		}

		else console.warn(`invalid attribute "${key}" type is "${typeof value}"`)
	},

	entries: (element: HTMLElement, entries: Iterable<[key: string, value: AttrValue]>) => {
		for (const [key, value] of entries)
			attrSet.any(element, key, value)
	},

	record: (element: HTMLElement, record: Record<string, AttrValue>) => {
		return attrSet.entries(element, Object.entries(record))
	},
}

