
import type {ParamNameFromSegment} from "./param-name-from-segment.js"

export type ParamNames<Path extends string> =
	Path extends `${infer Head}/${infer Tail}`
		? ParamNameFromSegment<Head> | ParamNames<Tail>
		: ParamNameFromSegment<Path>

