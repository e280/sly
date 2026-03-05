
import {css, html} from "lit"
import {shadow, useCss, useSignal} from "../../ui/index.js"

export const CounterShadow = shadow((start: number) => {
	useCss(css`button { color: cyan; }`)

	const $count = useSignal(start)
	const add = () => { $count.value++ }

	return html`
		<button @click="${add}">${$count()}</button>
	`
})

