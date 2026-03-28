
export type ParamNameFromSegment<S extends string> =
	S extends `{${infer Name}}`
		? Name extends "*"
			? never
			: Name
		: never

export type ParamNames<Path extends string> =
	Path extends `${infer Head}/${infer Tail}`
		? ParamNameFromSegment<Head> | ParamNames<Tail>
		: ParamNameFromSegment<Path>

export type ParamsFromPath<Path extends string> =
	[ParamNames<Path>] extends [never]
		? {}
		: {[K in ParamNames<Path>]: string}

export type HasSplat<Path extends string> =
	Path extends `{*}`
		? true
		: Path extends `${string}/{*}`
			? true
			: false

export type RouteFor<Path extends string> = (
	params: ParamsFromPath<Path>,
	...subpath: HasSplat<Path> extends true
		? [subpath: string]
		: []
) => unknown

export function spa<const R extends {[P in keyof R]: RouteFor<P & string>}>(routes: R) {
	return (path: string): ReturnType<R[keyof R]> | undefined => {
		// TODO
		void path
		void routes
		return undefined
	}
}

/** strip off leading slashes or hash-slash shenanigans */
export function norm(path: string): string {
	// TODO
	return path
}

