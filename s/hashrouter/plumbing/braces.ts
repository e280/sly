
import {Hasher, Route} from "./types.js"
import type {Content} from "../../ui/types.js"

type ParamKeys<S extends string> =
	S extends `${string}{${infer P}}${infer R}` ? P | ParamKeys<R> : never

type ParamsOf<S extends string> = Record<ParamKeys<S>, string>

export function braceHasher<S extends string>(spec: S): Hasher<[ParamsOf<S>]> {

	if (!spec.startsWith("#/"))
		throw new Error(`hash route spec must start with "#/"`)

	// capture names in order
	const names: string[] = []
	spec.replace(/\{([^}]+)\}/g, (_m, name: string) => {
		names.push(name)
		return ""
	})

	// build a regex that matches the full hash
	const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
	const pattern = "^" + escape(spec).replace(/\\\{[^}]+\\\}/g, "([^/]+)") + "$"
	const regex = new RegExp(pattern)

	function parse(hash: string): [ParamsOf<S>] | null {
		const m = regex.exec(hash)
		if (!m) return null
		const obj: Record<string, string> = {}
		for (const [index, name] of names.entries())
			obj[name] = decodeURIComponent(m[index + 1])
		return [obj as ParamsOf<S>]
	}

	function make(...[obj]: [ParamsOf<S>]): string {
		let out = spec
		for (const name of names) {
			const v = (obj as Record<string, string>)[name]
			if (v == null) throw new Error(`missing param "${name}"`)
			out = out.replace(
				new RegExp(`\\{${name.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\}`),
				encodeURIComponent(v),
			) as any
		}
		return out
	}

	return {parse, make}
}

export function braceRoute<S extends string>(
		spec: S,
		fn: (params: ParamsOf<S>) => Promise<Content>,
	): Route<[ParamsOf<S>]> {
	return { hasher: braceHasher(spec), fn }
}

