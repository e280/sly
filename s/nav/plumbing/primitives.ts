
import {ev, ob} from "@e280/stz"
import {Op} from "../../ops/op.js"
import {Hashnav, ResolvedRoute, Routes} from "./types.js"

export function eraseWindowHash() {
	const {pathname, search} = window.location
	history.replaceState(null, "", pathname + search)
}

export function normalizeHash(hash: string) {
	const homeEquivalents = [/^$/, /^#$/, /^#\/$/]
	return (homeEquivalents.some(regex => regex.test(hash)))
		? "#/"
		: hash
}

export function getNormalizedWindowHash() {
	const hash = normalizeHash(window.location.hash)
	if (hash === "#/") eraseWindowHash()
	return hash
}

export function setWindowHash(hash: string) {
	window.location.hash = hash
}

export function makeNavigation<R extends Routes>(
		routes: R,
		navigate: (hash: string) => Promise<ResolvedRoute<R>>,
	): Hashnav<R> {

	return ob(routes).map(route => (
		async(...params: string[]) => navigate(route.hasher.make(...params))
	))
}

export function resolveRoute<R extends Routes>(
		hash: string,
		routes: R,
	): ResolvedRoute<R> | null {

	for (const key in routes) {
		const route = routes[key]
		const params = route.hasher.parse(hash)
		if (params) {
			return {
				key,
				route,
				params,
				op: Op.promise(route.fn(...params))
			}
		}
	}

	return null
}

export function onHashChange(fn: (event: HashChangeEvent) => void) {
	return ev(window, {hashchange: fn})
}

