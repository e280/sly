
import {css} from "lit"
import {nap, repeat} from "@e280/stz"

import {view} from "../../../views/view.js"
import {cssReset} from "../../../views/css-reset.js"

const style = css`
:host {
	font-family: monospace;
}
`

export const AsciiAnim = view(use => (hz: number, anim: string[]) => {
	use.name("loading")
	use.styles(cssReset, style)
	const frame = use.signal(0)

	use.mount(() => repeat(async() => {
		await nap(1000 / hz)
		const next = frame() + 1
		frame(next >= anim.length ? 0 : next)
	}))

	return anim.at(frame())
})

