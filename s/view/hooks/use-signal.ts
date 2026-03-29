
import {signal, watch} from "@e280/strata"
import {useOnce} from "./use-once.js"
import {useLife} from "./use-life.js"

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

	return useLife(() => {
		const {result, dispose} = watch(collector, responder)
		return [result, dispose]
	})
}

