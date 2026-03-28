
export type ParamNameFromSegment<S extends string> =
	S extends `{${infer Name}}`
		? Name extends "*"
			? never
			: Name
		: never

