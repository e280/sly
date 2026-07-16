
import {Result} from "@e280/stz"
import {waitFormal} from "@e280/strata"
import {useOnce} from "./use-once.js"

export function useWaitFormal<Value, E = unknown>(
		input: Promise<Result<Value, E>> | (() => Promise<Result<Value, E>>),
	) {
	return useOnce(() => waitFormal<Value, E>(input))
}

