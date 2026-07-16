
import {useMounted} from "./use-mounted.js"

/** run the fn whenever the view is mounted */
export function useWake<Value>(fn: () => Value) {
	return useMounted(() => [fn(), () => {}])
}

