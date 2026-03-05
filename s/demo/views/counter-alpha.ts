
import {html} from "lit"
import {light, useSignal} from "../../ui/index.js"

export const CounterAlpha = light((start: number) => {
	const $count = useSignal(start)
	const add = () => { $count.value++ }

	return html`
		<button @click="${add}">${$count()}</button>
	`
})

