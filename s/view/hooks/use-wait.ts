
import {Result} from "@e280/stz"
import {wait, waitResult} from "@e280/strata"
import {useOnce} from "./use-once.js"

export function useWait<Value>(
		input: Promise<Value> | (() => Promise<Value>),
	) {
	return useOnce(() => wait<Value>(input))
}

export function useWaitResult<Value, E = unknown>(
		input: Promise<Result<Value, E>> | (() => Promise<Result<Value, E>>),
	) {
	return useOnce(() => waitResult<Value, E>(input))
}

