
import {tracker} from "@e280/strata"

export class Reactivity {
	#stoppers: (() => void)[] = []

	clear() {
		this.#stoppers.forEach(stop => stop())
		this.#stoppers = []
	}

	observe<X>(contentFn: () => X, rerender: () => Promise<void>) {
		const {seen, result} = tracker.observe(contentFn)
		this.clear()
		for (const item of seen) {
			const stop = tracker.subscribe(item, rerender)
			this.#stoppers.push(stop)
		}
		return result
	}
}

