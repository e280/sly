
import {useRef} from "./use-ref.js"
import {useMount} from "./use-mount.js"

/** mount/unmount lifecycle, but also return a value */
export function useLife<Value>(fn: () => [value: Value, dispose: () => void]) {
	const ref = useRef<Value>(undefined as Value)

	useMount(() => {
		const [value, dispose] = fn()
		ref.value = value
		return dispose
	})

	return ref.value
}

