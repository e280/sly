
import {css} from "lit"
import {nap, repeat} from "@e280/stz"

import {view} from "../../../views/view.js"
import {cssReset} from "../../../views/css-reset.js"

const style = css`
:host {
	font-family: monospace;
	white-space: pre;
}
`

export const AsciiAnim = view(use => ({hz, frames}: {
		hz: number,
		frames: string[],
	}) => {

	use.name("loading")
	use.styles(cssReset, style)
	const frame = use.signal(0)

	use.mount(() => repeat(async() => {
		await nap(1000 / hz)
		const next = frame() + 1
		frame(next >= frames.length ? 0 : next)
	}))

	return frames.at(frame())
})

