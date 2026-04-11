
import {makeSpinner} from "../make-spinner.js"
import {makeAsciiAnim} from "../parts/ascii-anim.js"
import {ErrorDisplay} from "../parts/error-display.js"

export const waveSpinner = makeSpinner(
	makeAsciiAnim(20, [
		":....",
		":....",
		"::...",
		".::..",
		"..::.",
		"...::",
		"....:",
		"....:",
		"...::",
		"..::.",
		".::..",
		"::...",
	]),
	ErrorDisplay,
)

