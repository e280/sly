
import {nap} from "@e280/stz"
import {expect, suite, test} from "@e280/science"

import {wait} from "./parts/tasks.js"
import {waitNeedErr, waitNeedOk} from "./parts/get.js"
import {isWaitDone, isWaitErr, isWaitPending} from "./parts/is.js"

export default suite({
	"wait fn, done": test(async() => {
		const [$wait, done] = wait(async() => {
			await nap(10)
			return 123
		})
		expect(isWaitPending($wait())).is(true)
		expect(await done).is(123)
		expect(isWaitDone($wait())).is(true)
		expect(waitNeedOk($wait())).is(123)
	}),

	"wait fn, failed": test(async() => {
		const [$wait, promise] = wait<number, Error>(async() => {
			await nap(10)
			throw new Error("uh oh")
		})
		expect(isWaitPending($wait())).is(true)
		expect(await promise).is(undefined)
		expect(isWaitErr($wait())).is(true)
		expect(waitNeedErr($wait()).message).is("uh oh")
	}),
})

