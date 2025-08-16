
import {nap, repeat} from "@e280/stz"
import {css, html, render} from "lit"

import {$} from "../features/dom/dollar.js"
import {view} from "../features/views/view.js"
import {cssReset} from "../features/views/css-reset.js"
import {loady} from "../features/kit/loady/ascii-loader.js"

console.log("🦝 sly")

const styles = css`
:host {
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;
}
`

const MyView = view(use => (greeting: string) => {
	use.name("my-view")
	use.styles(cssReset, styles)
	const count = use.signal(0)

	use.mount(() => repeat(async() => {
		await nap(1000)
		count.value++
	}))

	use.once(() => use.rendered.then(() => {
		console.log("slot!!", $("slot", use.shadow))
	}))

	const op = use.op.fn(async() => {
		await nap(2000)
		throw new Error("rofl bingus")
	})

	return html`
		<p>${greeting} <slot></slot> ${count()}</p>
		<p>${loady.dots(op, () => "done")}</p>
	`
})

render(
	MyView
		.attr("class", "incredi")
		.children("world")
		.props("hello"),
	$(".demo"),
)

