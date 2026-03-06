
import {tracker} from "@e280/strata"

export class Reactivity {
	#stoppers: (() => void)[] = []

	clear() {
		this.#stoppers.forEach(stop => stop())
		this.#stoppers = []
	}

	observe<X>(fn: () => X, rerender: () => Promise<void>) {
		const {seen, result} = tracker.observe(fn)
		this.clear()
		for (const item of seen) {
			const stop = tracker.subscribe(item, rerender)
			this.#stoppers.push(stop)
		}
		return result
	}
}

