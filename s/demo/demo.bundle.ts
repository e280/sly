
import {css, html} from "lit"
import {nap, repeat} from "@e280/stz"

import {$} from "../features/dom/dollar.js"
import {view} from "../features/views/view.js"
import {cssReset} from "../features/views/css-reset.js"
import {anims, makeLoader} from "../features/op/loader/make-loader.js"

console.log("🦝 sly")

const styles = css`
:host {
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;
}
`

export const loader = makeLoader(anims.aesthetic3)

const MyView = view(use => (greeting: string) => {
	use.name("my-view")
	use.styles(cssReset, styles)
	const count = use.signal(0)

	use.mount(() => repeat(async() => {
		await nap(1000)
		count.value++
	}))

	use.once(() => use.rendered.then(() => {
		console.log("slot", $("slot", use.shadow))
	}))

	const op = use.op.fn(async() => {
		await nap(5000)
	})

	return html`
		<p>${greeting} <slot></slot> ${count()}</p>
		<p>${loader(op, () => "op loaded")}</p>
	`
})

$.render(
	$(".demo"),
	MyView
		.attr("class", "incredi")
		.children("world")
		.props("hello"),
)

