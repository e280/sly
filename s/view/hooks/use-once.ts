
import {hooks} from "./plumbing/hooks.js"

/** run the fn only one time */
export function useOnce<Value>(fn: () => Value) {
	const {scope, position} = hooks.increment()
	return scope.values.guarantee(position, fn) as Value
}

