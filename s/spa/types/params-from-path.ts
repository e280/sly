
import type {ParamNames} from "./param-names.js"

export type ParamsFromPath<Path extends string> =
	[ParamNames<Path>] extends [never]
		? {}
		: {[K in ParamNames<Path>]: string}

