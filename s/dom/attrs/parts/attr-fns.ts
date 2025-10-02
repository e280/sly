
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

}

