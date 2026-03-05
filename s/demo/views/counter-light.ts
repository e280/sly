
import {html} from "lit"
import {light, useSignal} from "../../ui/index.js"

export const CounterLight = light((start: number) => {
	const $count = useSignal(start)
	const add = () => { $count.value++ }

	return html`
		<button @click="${add}">${$count()}</button>
	`
})

