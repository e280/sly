
import {station} from "./plumbing/station.js"

export function useOnce<Value>(fn: () => Value) {
	const {scope, position} = station.increment()
	return scope.values.guarantee(position, fn) as Value
}

