
import {wait} from "@e280/strata"
import {useOnce} from "./use-once.js"

export function useWait<Value>(
		input: Promise<Value> | (() => Promise<Value>),
	) {
	return useOnce(() => wait<Value>(input))
}

