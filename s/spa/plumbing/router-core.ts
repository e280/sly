
import {signal} from "@e280/strata"
import type {Content} from "../../view/types.js"
import {Navigable, normalizeHash, resolveRoute} from "./primitives.js"
import {Hashbearer, Navigables, ResolvedRoute, Routes} from "./types.js"

export class RouterCore<R extends Routes> {
	readonly nav: Navigables<R>
	readonly $resolved = signal<ResolvedRoute<R> | null>(null)

	constructor(
			public readonly routes: R,
			public readonly location: Hashbearer,
		) {

		this.nav = Navigable.all(
			routes,
			() => this.route,
			async hash => {
				this.location.hash = hash
				const resolved = await this.refresh()
				if (!resolved) throw new Error(`route failed "${hash}"`)
				return resolved
			},
		)
	}

	get hash() {
		return normalizeHash(this.location.hash)
	}

	get content(): Content | null {
		return this.$resolved.get()?.op.value ?? null
	}

	get route() {
		return this.$resolved.get()?.route ?? null
	}

	async refresh(hash?: string) {
		if (hash !== undefined) this.location.hash = hash
		hash = this.hash
		const resolved = resolveRoute(hash, this.routes)
		await this.$resolved.set(resolved)
		await resolved?.op
		return resolved
	}
}

