
import {Hookscope} from "./hookscope.js"

export class Hooks {
	#scopes: Hookscope[] = []

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

	wrap<Ret>(scope: Hookscope, fn: () => Ret) {
		scope.position = 0
		this.#scopes.push(scope)
		try { return fn() }
		finally { this.#scopes.pop() }
	}
}

export const hooks: Hooks = (globalThis as any)[Symbol.for("e280.hooks")] ??= new Hooks()

