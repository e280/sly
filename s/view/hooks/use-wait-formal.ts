
import {Result} from "@e280/stz"
import {waitFormal} from "@e280/strata"
import {useLifecycle} from "./use-lifecycle.js"
import {waitCleanup} from "./plumbing/use-wait-cleanup.js"

export function useWaitFormal<Value, E = unknown>(
		input: Promise<Result<Value, E>> | (() => Promise<Result<Value, E>>),
		cleanup: (value: Value) => void = () => {},
	) {


	return useLifecycle(() => {
		const $wait = waitFormal<Value, E>(input)
		return [$wait, waitCleanup($wait, cleanup)]
	})
}

