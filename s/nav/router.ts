
import {disposer} from "@e280/stz"
import {Content} from "../ui/types.js"
import {Loader} from "../loaders/types.js"
import {RouterCore} from "./plumbing/router-core.js"
import {makeLoader} from "../loaders/make-loader.js"
import {RouterOptions, Routes} from "./plumbing/types.js"
import {HashNormalizer, onHashChange} from "./plumbing/primitives.js"

export class Router<R extends Routes> extends RouterCore<R> {
	static async setup<R extends Routes>(options: RouterOptions<R>) {
		const router = new this(options)
		await router.refresh()
		router.listen()
		return router
	}

	loader: Loader
	notFound: () => Content
	readonly dispose = disposer()
	#lastHash: string

	constructor(options: RouterOptions<R>) {
		super(
			options.routes,
			options.location ?? new HashNormalizer(window.location),
		)
		this.loader = options.loader ?? makeLoader()
		this.notFound = options.notFound ?? (() => null)
		this.#lastHash = this.hash
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

