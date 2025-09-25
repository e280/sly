
import {Op} from "../../ops/op.js"
import type {Content} from "../../ui/types.js"
import { Navigable } from "./primitives.js"

export type Hasher<Params extends any[]> = {
	parse: (hash: string) => (Params | null)
	make: (...params: Params) => string
}

export type Route<Params extends any[]> = {
	hasher: Hasher<Params>
	fn: (...params: Params) => Promise<Content>
}

export type Routes = {[key: string]: Route<any>}

export type ResolvedRoute<R extends Routes, K extends keyof R = keyof R> = {
	key: K
	route: R[K]
	params: Parameters<R[K]["hasher"]["make"]>
	op: Op<Content>
}

export type Navigables<R extends Routes> = {
	[K in keyof R]: Navigable<R, K>
}

