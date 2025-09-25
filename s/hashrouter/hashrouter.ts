
import {disposer} from "@e280/stz"
import {signal} from "@e280/strata"
import type {Content} from "../ui/types.js"
import {Hashnav, ResolvedRoute, Routes} from "./plumbing/types.js"
import {getNormalizedWindowHash, makeNavigation, normalizeHash, onHashChange, resolveRoute, setWindowHash} from "./plumbing/primitives.js"

export class Hashrouter<R extends Routes> {
	static async setup<R extends Routes>(routes: R) {
		const router = new this({routes})
		await router.update()
		router.listen()
		return router
	}

	readonly routes: R
	readonly nav: Hashnav<R>
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

		this.nav = makeNavigation(options.routes, async hash => {
			this.#setHash(hash)
			const resolved = await this.update()
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

	async update() {
		const {hash} = this
		const resolved = await this.$resolved.set(resolveRoute(hash, this.routes))
		await resolved?.op
		return resolved
	}

	listen() {
		const dispose = onHashChange(() => this.update())
		this.dispose.schedule(dispose)
		return dispose
	}
}

