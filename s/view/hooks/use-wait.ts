
import {wait} from "@e280/strata"
import {useMounted} from "./use-mounted.js"
import {waitCleanup} from "./plumbing/wait-cleanup.js"

export function useWait<Value>(
		input: Promise<Value> | (() => Promise<Value>),
		cleanup: (value: Value) => void = () => {},
	) {

	return useMounted(() => {
		const $wait = wait<Value>(input)
		return [$wait, waitCleanup($wait, cleanup)]
	})
}

