
import {Result} from "@e280/stz"
import {waitFormal} from "@e280/strata"
import {useMounted} from "./use-mounted.js"
import {waitCleanup} from "./plumbing/wait-cleanup.js"

export function useWaitFormal<Value, E = unknown>(
		input: Promise<Result<Value, E>> | (() => Promise<Result<Value, E>>),
		cleanup: (value: Value) => void = () => {},
	) {


	return useMounted(() => {
		const $wait = waitFormal<Value, E>(input)
		return [$wait, waitCleanup($wait, cleanup)]
	})
}

