
import {Pod, PodSelect} from "./types.js"

export const podium = {
	status: (p: Pod<any>) => p[0],

	value: <V>(p: Pod<V>) => {
		return p[0] === "ready"
			? p[1]
			: undefined
	},

	error: <V>(p: Pod<V>) => {
		return p[0] === "error"
			? p[1]
			: undefined
	},

	select: <V, R>(p: Pod<V>, select: PodSelect<V, R>) => {
		switch (p[0]) {
			case "loading": return select.loading()
			case "error": return select.error(p[1])
			case "ready": return select.ready(p[1])
			default: throw new Error("unknown op status")
		}
	},

	morph: <A, B>(p: Pod<A>, fn: (a: A) => B): Pod<B> => {
		return podium.select<A, Pod<B>>(p, {
			loading: () => ["loading"],
			error: error => ["error", error],
			ready: a => ["ready", fn(a)],
		})
	},

	all: <V>(...ps: Pod<V>[]): Pod<V[]> => {
		const values: V[] = []
		const errors: any[] = []
		let loading = 0

		for (const p of ps) {
			switch (p[0]) {
				case "loading":
					loading++
					break

				case "ready":
					values.push(p[1])
					break

				case "error":
					errors.push(p[1])
					break
			}
		}

		if (errors.length > 0)
			return ["error", errors]

		else if (loading === 0)
			return ["ready", values]

		else
			return ["loading"]
	}
}

