
import {disposer} from "@e280/stz"
import {signal} from "@e280/strata"
import type {Content} from "../ui/types.js"
import {Navigables, ResolvedRoute, Routes} from "./plumbing/types.js"
import {getNormalizedWindowHash, Navigable, normalizeHash, onHashChange, resolveRoute, setWindowHash} from "./plumbing/primitives.js"

export class Router<R extends Routes> {
	static async setup<R extends Routes>(routes: R) {
		const router = new this({routes})
		await router.refresh()
		router.listen()
		return router
	}

	readonly routes: R
	readonly navs: Navigables<R>
	readonly dispose = disposer()
	readonly $resolved = signal<ResolvedRoute<R> | null>(null)

	#getHash: () => string
	#setHash: (hash: string) => void

	constructor(options: {
			routes: R
			getHash?: () => string
			setHash?: (hash: string) => void
		}) {

		this.routes = options.routes
		this.#getHash = options.getHash ?? getNormalizedWindowHash
		this.#setHash = options.setHash ?? setWindowHash

		this.navs = Navigable.all(options.routes, async hash => {
			this.#setHash(hash)
			const resolved = await this.refresh()
			if (!resolved) throw new Error(`route failed "${hash}"`)
			return resolved
		})
	}

	get hash() {
		return normalizeHash(this.#getHash())
	}

	get content(): Content | null {
		return this.$resolved.value?.op.value ?? null
	}

	async refresh(hash?: string) {
		hash = hash === undefined
			? this.hash
			: normalizeHash(hash)
		const resolved = await this.$resolved.set(resolveRoute(hash, this.routes))
		await resolved?.op
		return resolved
	}

	listen() {
		const dispose = onHashChange(() => this.refresh())
		this.dispose.schedule(dispose)
		return dispose
	}
}

