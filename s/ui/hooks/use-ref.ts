
import {useOnce} from "./use-once.js"

export function useRef<Value>(value: Value) {
	return useOnce(() => new Ref(value))
}

export class Ref<Value> {
	constructor(public value: Value) {}
}

