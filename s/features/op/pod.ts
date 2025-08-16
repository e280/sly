
import {Pod, PodSelect} from "./types.js"

export const pod = {
	value: <V>(pod: Pod<V>) => {
		return pod[0] === "ready"
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
}

