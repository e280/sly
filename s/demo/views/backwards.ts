
import {html} from "lit"
import {view} from "../../views/view.js"

export class BackwardsElement extends (view
	.component<{speed?: number}>()
	.props<[speed: number]>(el => [el.speed ?? 1])
	.render(use => speed => {
		const $count = use.signal(0)
		const increment = () => $count($count() + speed)
		return html`
			<span>${$count()}</span>
			<button @click="${increment}">+${speed}</button>
		`
	})
) {}

export const BackwardsView = BackwardsElement.view

