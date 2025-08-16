
import {css, html, render} from "lit"
import {$} from "../features/dom/dollar.js"
import {view} from "../features/views/view.js"

console.log("🦝 sly")

const MyView = view
.settings({name: "my-view", styles: css`:host {color: green;}`})
.view(use => (greeting: string) => {
	const count = use.signal(0)
	use.once(() => setInterval(() => { count.value++; }, 1000))

	use.once(() => {
		use.rendered.then(() => {
			console.log(use.renderCount)
			const slot = $("slot", use.shadow)
			console.log("slot!!", slot)
		})
	})

	return html`${greeting} <slot></slot> ${count()}`
})

render(MyView.content("world")("hello"), $(".demo"))

