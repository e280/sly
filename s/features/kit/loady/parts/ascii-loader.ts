
import {Op} from "../../../op/op.js"
import {AsciiAnim} from "./ascii-anim.js"
import {Content} from "../../../views/types.js"
import {ErrorDisplay} from "./error-display.js"

export function makeAsciiLoader(hz: number, anim: string[]) {
	return <V>(op: Op<V>, fn: (value: V) => Content) => op.select({
		loading: () => AsciiAnim(hz, anim),
		error: error => ErrorDisplay(error),
		ready: fn,
	})
}

