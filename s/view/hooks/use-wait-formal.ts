
import {Result} from "@e280/stz"
import {waitFormal} from "@e280/strata"
import {useOnce} from "./use-once.js"
import {useWaitCleanup} from "./plumbing/use-wait-cleanup.js"

export function useWaitFormal<Value, E = unknown>(
		input: Promise<Result<Value, E>> | (() => Promise<Result<Value, E>>),
		cleanup: (value: Value) => void = () => {},
	) {

	const $wait = useOnce(() => waitFormal<Value, E>(input))
	useWaitCleanup($wait, cleanup)
	return $wait
}

