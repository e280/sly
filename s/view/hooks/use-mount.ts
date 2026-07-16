
import {useOnce} from "./use-once.js"
import {hooks} from "./plumbing/hooks.js"

export function useMount(fn: () => () => void) {
	const {scope} = hooks.increment()
	return useOnce(() => scope.mounts.mount(fn))
}

