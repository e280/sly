
import {html} from "lit"
import {cycle, nap} from "@e280/stz"
import {useMount, useSignal} from "../../view/index.js"
import {lightElement} from "../../view/elements/light.js"

export class TimeLight extends lightElement(() => {
	const $time = useSignal(Date.now())

	useMount(() => cycle(async() => {
		await nap(100)
		$time(Date.now())
	}))

	return html`
		<p>${$time()}</p>
	`
}) {}

