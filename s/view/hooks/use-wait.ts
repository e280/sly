
import {Result} from "@e280/stz"
import {wait, waitFormal} from "@e280/strata"
import {useOnce} from "./use-once.js"

export function useWait<Value>(
		input: Promise<Value> | (() => Promise<Value>),
	) {
	return useOnce(() => wait<Value>(input))
}

export function useWaitFormal<Value, E = unknown>(
		input: Promise<Result<Value, E>> | (() => Promise<Result<Value, E>>),
	) {
	return useOnce(() => waitFormal<Value, E>(input))
}

/** @deprecated renamed to `useWaitFormal` */
export const useWaitResult = useWaitFormal

