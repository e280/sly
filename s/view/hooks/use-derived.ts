
import {derived} from "@e280/strata"
import {useOnce} from "./use-once.js"

export function useDerived<Value>(fn: () => Value) {
	return useOnce(() => derived(fn))
}

