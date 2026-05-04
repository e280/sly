
import {derived, effect, signal} from "@e280/strata"
import {useOnce} from "./use-once.js"
import {useMount} from "./use-mount.js"

export function useSignal<Value>(value: Value) {
	return useOnce(() => signal(value))
}

export function useDerived<Value>(fn: () => Value) {
	return useOnce(() => derived(fn))
}

export function useEffect(fn: () => void) {
	return useMount(() => effect(fn))
}

