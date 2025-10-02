
import {Queryable} from "../types.js"

export function queryRequire<E extends Element>(
		selector: string,
		container: Queryable = document,
	) {
	const e = container.querySelector<E>(selector)
	if (!e) throw new Error(`element not found (${selector})`)
	return e
}

export function queryMaybe<E extends Element>(
		selector: string,
		container: Queryable = document,
	) {
	return container.querySelector<E>(selector)
}

export function queryAll<E extends Element>(
		selector: string,
		container: Queryable = document,
	) {
	return Array.from(container.querySelectorAll<E>(selector))
}

