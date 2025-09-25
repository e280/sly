
import {Hasher, Route} from "./types.js"
import type {Content} from "../../ui/types.js"

type ParamKeys<S extends string> =
	S extends `${string}{${infer P}}${infer R}` ? (string & P) | ParamKeys<R> : never

type ParamsOf<S extends string> =
	[ParamKeys<S>] extends [never] ? {} : { [K in ParamKeys<S>]: string }

type ParamsTuple<S extends string> =
	keyof ParamsOf<S> extends never ? [] : [ParamsOf<S>]

export function hasher<S extends string>(spec: S): Hasher<ParamsTuple<S>> {
	if (!spec.startsWith("#/"))
		throw new Error(`hash route spec must start with "#/"`)

	const specparts = spec.split("/")
	const braceregex = /\{([^\}\/]+)\}/

	function parse(hash: string): ParamsTuple<S> | null {
		if (!hash.startsWith("#/"))
			throw new Error(`hash must start with "#/"`)

		const hashparts = hash.split("/")
		const params: Record<string, string> = {}

		if (hashparts.length !== specparts.length)
			return null

		for (const [index, specpart] of specparts.entries()) {
			const hashpart = hashparts.at(index)
			if (hashpart === undefined) return null
			const bracematch = specpart.match(braceregex)
			try {
				if (bracematch) params[bracematch[1]] = decodeURIComponent(hashpart)
				else if (hashpart !== specpart) return null
			}
			catch {
				return null
			}
		}

		return (Object.keys(params).length === 0)
			? ([] as ParamsTuple<S>)
			: ([params as ParamsOf<S>] as ParamsTuple<S>)
	}

	function make(...[braces]: any[]): string {
		const get = (param: string) => {
			const p = param as any
			if (p in braces) return braces[p]
			else throw new Error(`missing param "${p}"`)
		}
		return specparts.map(specpart => {
			const bracematch = specpart.match(braceregex)
			return bracematch
				? encodeURIComponent(get(bracematch[1]))
				: specpart
		}).join("/")
	}

	return {parse, make}
}

export function route<S extends string>(
		spec: S,
		fn: (...params: ParamsTuple<S>) => Promise<Content>,
	): Route<ParamsTuple<S>> {

	return {
		hasher: hasher(spec),
		fn,
	}
}

