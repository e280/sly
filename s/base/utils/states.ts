
export class States<S extends string = string> {
	#states: Set<S>

	constructor(element: HTMLElement) {
		this.#states = element.attachInternals().states as any
	}

	;[Symbol.iterator]() {
		return this.#states.values()
	}

	values() {
		return this.#states.values()
	}

	forEach(fn: (s: S) => void) {
		this.#states.forEach(fn)
		return this
	}

	add(...states: S[]) {
		for (const s of states) this.#states.add(s)
		return this
	}

	delete(...states: S[]) {
		for (const s of states) this.#states.delete(s)
		return this
	}

	clear() {
		this.#states.clear()
		return this
	}

	assign(...states: S[]) {
		this.#states.forEach(s => this.#states.delete(s))
		for (const s of states) this.#states.add(s)
		return this
	}
}

