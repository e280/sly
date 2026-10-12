
import {css, html} from "lit"
import {shadowView, useName, useCss, useSignal} from "../../view/index.js"

export const CounterShadow = shadowView((start: number) => {
	useName("counter-shadow")
	useCss(css`:host{display:inline-block} button{color:cyan}`)

	const $count = useSignal(start)
	const increment = () => $count($count() + 1)

	return html`
		<button @click="${increment}">${$count()}</button>
	`
})

