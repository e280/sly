
import {MapG} from "@e280/stz"
import {tracker} from "@e280/strata"

export class Reactor {
	#map = new MapG<any, () => void>()

	effect<R>(collect: () => R, respond: () => Promise<void>) {
		const {seen, result} = tracker.observe(collect)

		// add seen items
		for (const item of seen)
			this.#map.guarantee(item, () => tracker.subscribe(item, respond))

		// remove orphaned items
		for (const [item, dispose] of this.#map) {
			if (!seen.has(item)) {
				dispose()
				this.#map.delete(item)
			}
		}

		return result
	}

	clear() {
		for (const dispose of this.#map.values())
			dispose()
		this.#map.clear()
	}
}

