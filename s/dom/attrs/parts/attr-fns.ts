
/** fns for getting and setting html attributes of various types */
export const attrFns = {
	get: {
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
	},

	set: {
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
	},
}

