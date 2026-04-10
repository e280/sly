
import {css} from "lit"
import {nap, cycle} from "@e280/stz"
import {Content} from "../../view/types.js"
import {cssReset, shadow, useMount, useName, useSignal, useStyles} from "../../view/index.js"

export function makeAsciiAnim(hz: number, frames: string[]): () => Content {
	return () => AsciiAnim({hz, frames})
}

export const AsciiAnim = shadow(({hz, frames}: {
		hz: number,
		frames: string[],
	}) => {

	useName("loading")
	useStyles(cssReset, style)

	const frame = useSignal(0)

	useMount(() => cycle(async() => {
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

