
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

export const attributes = <A extends AttrSpec>(
		element: HTMLElement,
		spec: A,
	) => new Proxy(spec, {

	get: (_target, name: string) => {
		const type = spec[name]
		const raw = element.getAttribute(name)

		switch (type) {
			case String:
				return raw ?? undefined

			case Number:
				return raw !== null
					? Number(raw)
					: undefined

			case Boolean:
				return raw !== null

			default:
				throw new Error(`invalid attribute type for "${name}"`)
		}
	},

	set: (_target, name: string, value: any) => {
		const type = spec[name]

		switch (type) {
			case String: {
				element.setAttribute(name, value)
				return true
			}

			case Number: {
				element.setAttribute(name, value.toString())
				return true
			}

			case Boolean: {
				if (value)
					element.setAttribute(name, "")
				else
					element.removeAttribute(name)
				return true
			}

			default:
				throw new Error(`invalid attribute type for "${name}"`)
		}
	},

}) as any as AttrTypes<A>

export function onAttrChange(element: HTMLElement, fn: () => void) {
	const observer = new MutationObserver(fn)
	observer.observe(element, {attributes: true})
	return () => observer.disconnect()
}

