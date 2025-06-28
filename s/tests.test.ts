
import {Science, test, expect} from "@e280/science"

await Science.run({
	"math works": test(async() => {
		expect(2 + 2).is(4)
	}),
})

