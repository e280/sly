
import {useLife} from "./use-life.js";

export function useWake<Value>(fn: () => Value) {
	return useLife(() => [fn(), () => {}])
}

