
import {useLifecycle} from "./use-lifecycle.js";

/** run the fn whenever the view is mounted */
export function useWake<Value>(fn: () => Value) {
	return useLifecycle(() => [fn(), () => {}])
}

