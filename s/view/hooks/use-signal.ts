
import {signal} from "@e280/strata"
import {useOnce} from "./use-once.js"

export function useSignal<Value>(value: Value) {
	return useOnce(() => signal(value))
}

export function useDerived<Value>(fn: () => Value) {
	return useOnce(() => signal.derived(fn))
}

export function useLazy<Value>(fn: () => Value) {
	return useOnce(() => signal.lazy(fn))
}

