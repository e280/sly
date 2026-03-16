
import {useOnce} from "./use-once.js"

export function useRef<Value>(initial: Value) {
	return useOnce(() => new Ref(initial))
}

export class Ref<Value> {
	constructor(public current: Value) {}
}

