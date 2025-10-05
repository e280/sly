
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

	get size() {
		return this.#states.size
	}

	has(state: S) {
		return this.#states.has(state)
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
		return this.clear().add(...states)
	}
}

