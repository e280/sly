
import {useMount} from "./use-mount.js"

export function useUnmount(fn: () => void) {
	return useMount(() => fn)
}

