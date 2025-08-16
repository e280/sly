
import {nap, repeat} from "@e280/stz"
import {css, html, render} from "lit"
import {$} from "../features/dom/dollar.js"
import {view} from "../features/views/view.js"

console.log("🦝 sly")

const MyView = view
.settings({name: "my-view", styles: css`:host {color: green;}`})
.view(use => (greeting: string) => {
	const count = use.signal(0)

	use.mount(() => repeat(async() => {
		await nap(1000)
		count.value++
	}))

	use.once(() => use.rendered.then(() => {
		console.log("slot!!", $("slot", use.shadow))
	}))

	return html`${greeting} <slot></slot> ${count()}`
})

render(MyView.content("world")("hello"), $(".demo"))

