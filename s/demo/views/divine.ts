
import {html} from "lit"
import {signal} from "@e280/strata"
import {view} from "../../views/view.js"
import {BaseElement} from "../../views/base-element.js"

export class DivineElement extends (
	view(use => (speed: number) => {
		const $count = use.signal(0)
		const increment = () => $count($count() + speed)
		return html`
			<span>${$count()}</span>
			<button @click="${increment}">+${speed}</button>
		`
	})
	.component(class extends BaseElement {
		$speed = signal(1)
	})
	.props(component => [component.$speed()])
) {}

export const DivineView = DivineElement.view

