
import {Signal} from "./signal.js"
import {Effect} from "./effect.js"

export function computed<V>(fn: () => V) {
	return new Computed<V>(fn)
}

export class Computed<V> extends Signal<V> {
	#dirty = false
	#formula: () => V
	#effect: Effect<V>

	constructor(formula: () => V) {
		const effect = new Effect(formula, () => this.#dirty = true)
		super(effect.initial)
		this.#effect = effect
		this.#formula = formula
	}

	get value() {
		if (this.#dirty) {
			this.#dirty = false
			super.value = this.#formula()
		}
		return super.value
	}

	set value(_) {
		throw new Error("computed is readonly")
	}

	get wait() {
		return this.#effect.wait
	}

	dispose() {
		this.#effect.dispose()
		super.dispose()
	}
}

