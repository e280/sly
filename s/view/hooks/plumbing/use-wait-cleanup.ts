
import {once} from "@e280/stz"
import {isWaitOk, Waiter} from "@e280/strata"
import {useRef} from "../use-ref.js"
import {useOnce} from "../use-once.js"
import {useUnmount} from "../use-unmount.js"

export function useWaitCleanup<Value>(
		$wait: Waiter<Value>,
		cleanup: (value: Value) => void,
	) {

	const abandoned = useRef(false)
	const cleanupOnce = useOnce(() => once(cleanup))

	useOnce(() => {
		$wait.result.then(waited => {
			if (abandoned.current && isWaitOk(waited))
				cleanupOnce(waited.value)
		})
	})

	useUnmount(() => {
		abandoned.current = true
		const waited = $wait()
		if (isWaitOk(waited))
			cleanupOnce(waited.value)
	})
}

