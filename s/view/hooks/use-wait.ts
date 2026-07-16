
import {wait} from "@e280/strata"
import {useOnce} from "./use-once.js"
import {useWaitCleanup} from "./plumbing/use-wait-cleanup.js"

export function useWait<Value>(
		input: Promise<Value> | (() => Promise<Value>),
		cleanup: (value: Value) => void = () => {},
	) {

	const $wait = useOnce(() => wait<Value>(input))
	useWaitCleanup($wait, cleanup)
	return $wait
}

