
import {html} from "lit"
import {light, useSignal} from "../../view/index.js"

export const CounterLight = light((start: number) => {
	const $count = useSignal(start)
	const increment = () => $count($count() + 1)

	return html`
		<button @click="${increment}">${$count()}</button>
	`
})

