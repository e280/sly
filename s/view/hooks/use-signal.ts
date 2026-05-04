
import {derived, effect, signal} from "@e280/strata"
import {useOnce} from "./use-once.js"
import {useLifecycle} from "./use-lifecycle.js"

export function useSignal<Value>(value: Value) {
	return useOnce(() => signal(value))
}

export function useDerived<Value>(fn: () => Value) {
	return useOnce(() => derived(fn))
}

export function useEffect<Value>(
		collector: () => Value,
		responder?: (value: Value) => void,
	) {

	return useLifecycle(() => {
		let value!: Value
		const dispose = effect(() => value = collector(), responder)
		return [value, dispose]
	})
}

