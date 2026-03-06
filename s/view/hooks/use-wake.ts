
import {useLife} from "./use-life.js";

/** run the fn whenever the view is mounted */
export function useWake<Value>(fn: () => Value) {
	return useLife(() => [fn(), () => {}])
}

