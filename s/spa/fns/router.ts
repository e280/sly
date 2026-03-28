
import type {RouteFor} from "../types/route-for.js"

export function router<const R extends {[P in keyof R]: RouteFor<P & string>}>(routes: R) {
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

