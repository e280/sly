
import {Scope} from "./scope.js"

export class Station {
	#scopes: Scope[] = []

	get scope() {
		const scope = this.#scopes.at(-1)
		if (!scope) throw new Error("hooks must be called within a render fn")
		return scope
	}

	increment() {
		const scope = this.scope
		const position = scope.position++
		return {scope, position}
	}

	wrap<Ret>(scope: Scope, fn: () => Ret) {
		scope.position = 0
		this.#scopes.push(scope)
		try { return fn() }
		finally { this.#scopes.pop() }
	}
}

export const station: Station = (globalThis as any)[Symbol.for("e280.station")] ??= new Station()

