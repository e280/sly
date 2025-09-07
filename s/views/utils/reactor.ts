
import {MapG} from "@e280/stz"
import {tracker} from "@e280/strata"

export class Reactor {
	#map = new MapG<any, () => void>()

	constructor() {}

	effect<R>(collect: () => R, respond: () => Promise<void>) {
		const {seen, result} = tracker.observe(collect)
		for (const item of seen)
			this.#map.guarantee(item, () => tracker.subscribe(item, respond))
		return result
	}

	clear() {
		for (const dispose of this.#map.values())
			dispose()
		this.#map.clear()
	}
}

