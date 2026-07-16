
import {signal} from "@e280/strata"
import {useOnce} from "./use-once.js"

export function useSignal<Value>(value: Value) {
	return useOnce(() => signal(value))
}

