
import {station} from "./plumbing/station.js"

/** run the fn only one time */
export function useOnce<Value>(fn: () => Value) {
	const {scope, position} = station.increment()
	return scope.values.guarantee(position, fn) as Value
}

