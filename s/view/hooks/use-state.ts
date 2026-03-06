
import {useRef} from "./use-ref.js"
import {useRender} from "./use-cx.js"

export function useState<Value>(value: Value) {
	const render = useRender()
	const ref = useRef(value)

	const set = (next: Value | ((prev: Value) => Value)) => {
		const value = typeof next === "function"
			? (next as (prev: Value) => Value)(ref.value)
			: next
		if (Object.is(value, ref.value)) return
		ref.value = value
		render()
	}

	return [ref.value, set] as const
}

