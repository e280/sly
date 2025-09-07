
export type AttrKind = (
	| typeof String
	| typeof Number
	| typeof Boolean
)

export type AttrType<H extends AttrKind> = (
	H extends typeof String
		? string | undefined

	: H extends typeof Number
		? number | undefined

	: H extends typeof Boolean
		? boolean

	: never
)

export type AttrSpec = {
	[key: string]: AttrKind
}

export type AttrTypes<A extends AttrSpec> = {
	[P in keyof A]: AttrType<A[P]>
}

/** respond when any attribute changes on the html element */
export function onAttrChange(element: HTMLElement, fn: () => void) {
	const observer = new MutationObserver(fn)
	observer.observe(element, {attributes: true})
	return () => observer.disconnect()
}

/** fns for getting and setting html attributes of various types */
export const attr = {
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

/** specify available html attributes and their types and create a proxy accessor */
export const attrs = <A extends AttrSpec>(
		e: HTMLElement,
		spec: A,
	) => new Proxy(spec, {

	get: (_target, key: string) => {
		switch (spec[key]) {
			case String: return attr.get.string(e, key)
			case Number: return attr.get.number(e, key)
			case Boolean: return attr.get.boolean(e, key)
			default: throw new Error(`invalid attribute type for "${key}"`)
		}
	},

	set: (_target, key: string, value: any) => {
		switch (spec[key]) {
			case String: return attr.set.string(e, key, value)
			case Number: return attr.set.number(e, key, value)
			case Boolean: return attr.set.boolean(e, key, value)
			default: throw new Error(`invalid attribute type for "${key}"`)
		}
	},
}) as any as AttrTypes<A>

/** create a typed proxy accessor for html attributes */
export function attrProxies(element: HTMLElement) {
	return new AttrProxies(element)
}

/** a typed proxy accessor for html attributes */
export class AttrProxies {
	constructor(public element: HTMLElement) {}

	string = new Proxy({}, {
		get: (_t, key: string) => this.element.getAttribute(key) ?? undefined,
		set: (_t, key: string, value: string) => {
			this.element.setAttribute(key, value)
			return true
		},
	}) as Record<string, string | undefined>

	number = new Proxy({}, {
		get: (_t, key: string) => {
			const raw = this.element.getAttribute(key)
			return raw !== null
				? Number(raw)
				: undefined
		},
		set: (_t, key: string, value: number | undefined) => {
			if (value === undefined) {
				this.element.removeAttribute(key)
				return true
			}
			this.element.setAttribute(key, value.toString())
			return true
		},
	}) as Record<string, number | undefined>

	boolean = new Proxy({}, {
		get: (_t, key: string) => {
			const raw = this.element.getAttribute(key)
			return raw !== null
				? Number(raw)
				: undefined
		},
		set: (_t, key: string, value: number | undefined) => {
			if (value === undefined) {
				this.element.removeAttribute(key)
				return true
			}
			this.element.setAttribute(key, value.toString())
			return true
		},
	}) as Record<string, number | undefined>
}

