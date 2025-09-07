
import {html} from "lit"
import {view} from "../../views/view.js"
import {signal, SignalFn} from "@e280/strata"

export class DivineElement extends (view
	.component<{$speed: SignalFn<number>}>(component => {
		component.$speed = signal(1)
	})
	.props<[speed: number]>(component => [component.$speed()])
	.render(use => speed => {
		const $count = use.signal(0)
		const increment = () => $count($count() + speed)
		return html`
			<span>${$count()}</span>
			<button @click="${increment}">+${speed}</button>
		`
	})
) {}

export const DivineView = DivineElement.view

