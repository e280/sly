
import {html} from "lit"
import {light, useSignal} from "../../view/index.js"

export const CounterLight = light((start: number) => {
	const $count = useSignal(start)
	const increment = () => $count.value++

	return html`
		<button @click="${increment}">${$count()}</button>
	`
})

