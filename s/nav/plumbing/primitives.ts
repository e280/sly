
import {ev, ob} from "@e280/stz"
import {Op} from "../../ops/op.js"
import {ResolvedRoute, Route, Routes} from "./types.js"

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

export class HashNormalizer {
	constructor(public location: Location) {}

	get hash() {
		const hash = normalizeHash(this.location.hash)
		if (hash === "#/") eraseWindowHash()
		return hash
	}

	set hash(hash: string) {
		this.location.hash = hash
	}
}

export class Navigable<R extends Routes, K extends keyof R> {
	static all<R extends Routes>(
			routes: R,
			navigate: (hash: string) => Promise<ResolvedRoute<R>>,
		): {[K in keyof R]: Navigable<R, K>} {

		return ob(routes).map(route => new this(
			route,
			async(...params: any[]) => navigate(route.hasher.make(...params)),
		))
	}

	constructor(
		public route: Route<Parameters<R[K]["hasher"]["make"]>>,
		public go: (...params: Parameters<R[K]["hasher"]["make"]>) => Promise<ResolvedRoute<R>>,
	) {}

	hash(...params: Parameters<R[K]["hasher"]["make"]>) {
		return this.route.hasher.make(...params)
	}
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

