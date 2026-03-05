
import {station} from "./plumbing/station.js"

export function useRef<Value>(value: Value) {
	const {scope, position} = station.increment()
	return scope.refs.guarantee(position, () => new Ref(value))
}

export class Ref<Value> {
	constructor(public value: Value) {}
}

