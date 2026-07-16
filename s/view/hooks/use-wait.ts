
import {wait} from "@e280/strata"
import {useLifecycle} from "./use-lifecycle.js"
import {waitCleanup} from "./plumbing/use-wait-cleanup.js"

export function useWait<Value>(
		input: Promise<Value> | (() => Promise<Value>),
		cleanup: (value: Value) => void = () => {},
	) {

	return useLifecycle(() => {
		const $wait = wait<Value>(input)
		return [$wait, waitCleanup($wait, cleanup)]
	})
}

