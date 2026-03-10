
import {Pod, PodSelect} from "./types.js"

export const podium = {
	status: (pod: Pod<any>) => pod[0],

	value: <V>(pod: Pod<V>) => {
		return pod[0] === "ready"
			? pod[1]
			: undefined
	},

	error: <V>(pod: Pod<V>) => {
		return pod[0] === "error"
			? pod[1]
			: undefined
	},

	select: <V, R>(pod: Pod<V>, select: PodSelect<V, R>) => {
		switch (pod[0]) {
			case "loading": return select.loading()
			case "error": return select.error(pod[1])
			case "ready": return select.ready(pod[1])
			default: throw new Error("unknown op status")
		}
	},

	morph: <A, B>(pod: Pod<A>, fn: (a: A) => B): Pod<B> => {
		return podium.select<A, Pod<B>>(pod, {
			loading: () => ["loading"],
			error: error => ["error", error],
			ready: a => ["ready", fn(a)],
		})
	},

	all: <V>(...pods: Pod<V>[]): Pod<V[]> => {
		const values: V[] = []
		const errors: any[] = []
		let loading = 0

		for (const pod of pods) {
			switch (pod[0]) {
				case "loading":
					loading++
					break

				case "ready":
					values.push(pod[1])
					break

				case "error":
					errors.push(pod[1])
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

