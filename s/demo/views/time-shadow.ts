
import {css, html} from "lit"
import {cycle, nap} from "@e280/stz"
import {shadowElement} from "../../view/elements/shadow.js"
import {useCss, useMount, useName, useSignal} from "../../view/index.js"

export class TimeShadow extends shadowElement(() => {
	useName("time-shadow")
	useCss(css`:host{display:inline-block} button{color:cyan}`)

	const $time = useSignal(Date.now())

	useMount(() => cycle(async() => {
		await nap(100)
		$time(Date.now())
	}))

	return html`
		<p>${$time()}</p>
	`
}) {}

