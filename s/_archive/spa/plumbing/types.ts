
import type {Op} from "../../ops/op.js"
import type {Navigable} from "./primitives.js"
import type {Content} from "../../view/types.js"
import type {Loader} from "../../loaders/types.js"

export type RouterOptions<R extends Routes> = {
	routes: R
	auto?: boolean
	location?: Hashbearer
	loader?: Loader
	notFound?: () => Content
}

export type Hashbearer = {hash: string}

export type Hasher<Params extends any[]> = {
	parse: (hash: string) => (Params | null)
	make: (...params: Params) => string
}

export type Route<P extends any[] = any[]> = {
	hasher: Hasher<P>
	fn: (...params: P) => Promise<Content>
}

export type Routes = {[key: string]: Route}

export type Params<X extends (Route | Navigable)> = (
	X extends Route<infer P> ? P :
	X extends Navigable<infer P> ? P :
	never
)

export type ResolvedRoute<P extends any[] = any[]> = {
	key: string
	route: Route<P>
	params: P
	op: Op<Content>
}

export type Navigables<R extends Routes> = {
	[K in keyof R]: Navigable<Params<R[K]>>
}

