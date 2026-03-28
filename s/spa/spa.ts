
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
	type Handler = (...args: any[]) => ReturnType<R[keyof R]>
	const compiled = Object.entries(routes).map(([pattern, route]) => {
		const segments = pattern === "" ? [] : pattern.split("/")
		const hasSplat = segments.at(-1) === "{*}"
		const prefixLength = hasSplat ? segments.length - 1 : segments.length
		return {
			segments,
			hasSplat,
			prefixLength,
			route: route as Handler,
		}
	})

	return (path: string): ReturnType<R[keyof R]> | undefined => {
		const pathSegments = path === "" ? [] : path.split("/")

		for (const {segments, hasSplat, prefixLength, route} of compiled) {
			if (hasSplat) {
				if (pathSegments.length < prefixLength)
					continue
			}
			else if (pathSegments.length !== prefixLength)
				continue

			const params: Record<string, string> = {}
			let matched = true

			for (let i = 0; i < prefixLength; i++) {
				const patternSegment = segments[i]
				const pathSegment = pathSegments[i]

				if (
					patternSegment.startsWith("{") &&
					patternSegment.endsWith("}") &&
					patternSegment !== "{*}"
				) {
					params[patternSegment.slice(1, -1)] = pathSegment
				}
				else if (patternSegment !== pathSegment) {
					matched = false
					break
				}
			}

			if (!matched)
				continue

			if (hasSplat)
				return route(params, pathSegments.slice(prefixLength).join("/"))

			return route(params)
		}

		return undefined
	}
}

/** strip off leading slashes or hash-slash shenanigans */
export function norm(path: string): string {
	if (path.startsWith("#"))
		path = path.slice(1)

	while (path.startsWith("/"))
		path = path.slice(1)

	return path
}
