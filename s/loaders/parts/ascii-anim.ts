
import {css} from "lit"
import {nap, repeat} from "@e280/stz"

import {view} from "../../view/view.js"
import {Content} from "../../view/types.js"
import {cssReset} from "../../base/css-reset.js"

export function makeAsciiAnim(hz: number, frames: string[]): () => Content {
	return () => AsciiAnim({hz, frames})
}

export const AsciiAnim = view(use => ({hz, frames}: {
		hz: number,
		frames: string[],
	}) => {

	use.name("loading")
	use.styles(cssReset, style)

	const frame = use.signal(0)

	use.mount(() => repeat(async() => {
		await nap(1000 / hz)
		const next = frame.get() + 1
		frame.set(next >= frames.length ? 0 : next)
	}))

	return frames.at(frame.get())
})

const style = css`
:host {
	font-family: monospace;
	white-space: pre;
	user-select: none;
}
`

