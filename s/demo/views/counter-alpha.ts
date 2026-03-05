
import {html} from "lit"
import {signal} from "@e280/strata"
import {light, useOnce} from "../../ui/index.js"

export const CounterAlpha = light((start: number) => {
	const $count = useOnce(() => signal(start))
	const add = () => { $count.value++ }

	return html`
		<button @click="${add}">${$count()}</button>
	`
})

