
import {guarantee} from "@e280/stz"
import {hooks} from "./plumbing/hooks.js"

/** run the fn only one time */
export function useOnce<Value>(fn: () => Value) {
	const {scope, position} = hooks.increment()
	return guarantee(scope.values, position, fn) as Value
}

