
import {html} from "lit"
import {cycle, nap} from "@e280/stz"
import {view} from "../../view/view.js"

export const MountingTest = view(use => () => {
	const $toggle = use.signal(false)

	use.mount(() => cycle(async() => {
		await nap(1000)
		$toggle(!$toggle())
	}))

	return $toggle()
		? TestAlpha()
		: html`bravo`
})

export const TestAlpha = view(() => () => {
	return html`
		<span>${TestCharlie()}</span>
	`
})


export const TestCharlie = view(use => () => {
	use.mount(() => {
		console.log("mount")

		// TODO error, this unmount is never called!
		return () => console.log("unmount")
	})

	return html`charlie`
})

