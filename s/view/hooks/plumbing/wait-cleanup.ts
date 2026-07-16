
import {once} from "@e280/stz"
import {isWaitOk, Waiter} from "@e280/strata"

export function waitCleanup<Value>(
		$wait: Waiter<Value>,
		cleanup: (value: Value) => void,
	) {

	let abandoned = false
	const cleanupOnce = once(cleanup)

	void $wait.result.then(waited => {
		if (abandoned && isWaitOk(waited))
			cleanupOnce(waited.value)
	})
	
	return function abandon() {
		abandoned = true
		const waited = $wait()
		if (isWaitOk(waited))
			cleanupOnce(waited.value)
	}
}

