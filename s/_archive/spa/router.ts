
import {disposer} from "@e280/stz"
import {Content} from "../view/types.js"
import {Loader} from "../loaders/types.js"
import {loaders} from "../loaders/index.js"
import {RouterCore} from "./plumbing/router-core.js"
import {RouterOptions, Routes} from "./plumbing/types.js"
import {HashNormalizer, onHashChange} from "./plumbing/primitives.js"

export class Router<R extends Routes> extends RouterCore<R> {
	loader: Loader
	notFound: () => Content
	readonly dispose = disposer()
	#lastHash: string

	constructor(options: RouterOptions<R>) {
		super(
			options.routes,
			options.location ?? new HashNormalizer(window.location),
		)
		const {auto = true} = options
		this.loader = options.loader ?? loaders.make()
		this.notFound = options.notFound ?? (() => null)
		this.#lastHash = this.hash
		if (auto) {
			this.listen()
			this.refresh()
		}
	}

	render() {
		const resolved = this.$resolved.get()
		return resolved === null
			? this.notFound()
			: this.loader(resolved.op, content => content)
	}

	listen() {
		const dispose = onHashChange(() => {
			const hash = this.hash
			const isChanged = hash !== this.#lastHash
			this.#lastHash = hash
			if (isChanged) this.refresh()
		})
		this.dispose.schedule(dispose)
		return dispose
	}
}

