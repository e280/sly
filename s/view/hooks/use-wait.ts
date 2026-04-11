
import {Result} from "@e280/stz"
import {useOnce} from "./use-once.js"
import {wait, waitResult} from "../../wait/index.js"

export function useWait<Value>(
		input: Promise<Value> | (() => Promise<Value>),
	) {
	return useOnce(() => {
		const [$wait] = wait<Value>(input)
		return $wait
	})
}

export function useWaitResult<Value, E = unknown>(
		input: Promise<Result<Value, E>> | (() => Promise<Result<Value, E>>),
	) {
	return useOnce(() => {
		const [$wait] = waitResult<Value, E>(input)
		return $wait
	})
}

