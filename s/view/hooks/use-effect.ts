
import {effect} from "@e280/strata"
import {useMount} from "./use-mount.js"

export function useEffect(fn: () => void) {
	return useMount(() => effect(fn))
}

