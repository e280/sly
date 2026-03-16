
import {useRef} from "./use-ref.js"
import {useRender} from "./use-cx.js"

export function useState<Value>(value: Value) {
	const render = useRender()
	const ref = useRef(value)

	const set = (next: Value | ((prev: Value) => Value)) => {
		const value = typeof next === "function"
			? (next as (prev: Value) => Value)(ref.current)
			: next
		if (Object.is(value, ref.current)) return
		ref.current = value
		render()
	}

	return [ref.current, set] as const
}

