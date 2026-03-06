
import {css, html} from "lit"
import {shadow, useName, useCss, useSignal} from "../../ui/index.js"

export const CounterShadow = shadow((start: number) => {
	useName("counter-shadow")
	useCss(css`button { color: cyan }`)

	const $count = useSignal(start)
	const increment = () => $count.value++

	return html`
		<button @click="${increment}">${$count()}</button>
	`
})

