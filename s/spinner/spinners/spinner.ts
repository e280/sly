
import {makeSpinner} from "../make-spinner.js"
import {makeAsciiAnim} from "../parts/ascii-anim.js"
import {ErrorDisplay} from "../parts/error-display.js"

export const spinner = makeSpinner(
	makeAsciiAnim(12, ["|", "/", "-", "\\"]),
	ErrorDisplay,
)

