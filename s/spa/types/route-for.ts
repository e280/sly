
import type {HasSplat} from "./has-splat.js"
import type {ParamsFromPath} from "./params-from-path.js"

export type RouteFor<Path extends string> = (
	params: ParamsFromPath<Path>,
	...subpath: HasSplat<Path> extends true
		? [subpath: string]
		: []
) => unknown

