
import {makeSpinner} from "../make-spinner.js"
import {makeAsciiAnim} from "../parts/ascii-anim.js"
import {ErrorDisplay} from "../parts/error-display.js"

export const earthSpinner = makeSpinner(
	makeAsciiAnim(4, ["🌎", "🌏", "🌍"]),
	ErrorDisplay,
)

