
import {signal, watch} from "@e280/strata"
import {useOnce} from "./use-once.js"
import {useLifecycle} from "./use-lifecycle.js"

export function useSignal<Value>(value: Value) {
	return useOnce(() => signal(value))
}

export function useDerived<Value>(fn: () => Value) {
	return useOnce(() => signal.derived(fn))
}

export function useLazy<Value>(fn: () => Value) {
	return useOnce(() => signal.lazy(fn))
}

export function useEffect<Value>(
		collector: () => Value,
		responder?: (value: Value) => void,
	) {

	return useLifecycle(() => {
		const {result, dispose} = watch(collector, responder)
		return [result, dispose]
	})
}

