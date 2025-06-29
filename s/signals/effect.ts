
import {debounce, tracker} from "@e280/stz"

export function effect<C = void>(collector: () => C, responder?: () => void) {
	return new Effect<C>(collector, responder)
}

export class Effect<C = void> {
	initial: C
	wait = Promise.resolve()
	dispose: () => void

	constructor(collector: () => C, responder: () => void = collector) {
		const {seen, result} = tracker.seen(collector)
		this.initial = result
		const fn1 = debounce(0, responder)
		const fn2 = () => this.wait = fn1()

		const disposers: (() => void)[] = []
		this.dispose = () => disposers.forEach(d => d())

		for (const saw of seen) {
			const dispose = tracker.changed(saw, fn2)
			disposers.push(dispose)
		}
	}
}

