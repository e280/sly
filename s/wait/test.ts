
import {nap} from "@e280/stz"
import {expect, suite, test} from "@e280/science"

import {wait} from "./parts/tasks.js"
import {isWaitDone, isWaitFailed, isWaitPending, needWaitFail, needWaitValue} from "./parts/readers.js"

export default suite({
	"wait fn, done": test(async() => {
		const [$wait, done] = wait(async() => {
			await nap(10)
			return 123
		})
		expect(isWaitPending($wait())).is(true)
		expect(await done).is(123)
		expect(isWaitDone($wait())).is(true)
		expect(needWaitValue($wait())).is(123)
	}),

	"wait fn, failed": test(async() => {
		const [$wait, done] = wait(async() => {
			await nap(10)
			throw new Error("uh oh")
		})
		expect(isWaitPending($wait())).is(true)
		expect(await done).is(undefined)
		expect(isWaitFailed($wait())).is(true)
		expect(needWaitFail($wait())).is("uh oh")
	}),
})

