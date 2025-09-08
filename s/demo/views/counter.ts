
import {css, html} from "lit"

import {dom} from "../../dom/dom.js"
import {view} from "../../ui/view.js"
import {cssReset} from "../../ui/base/css-reset.js"
import {BaseElement} from "../../ui/base-element.js"

export const CounterView = view(use => (start: number, step: number) => {
	use.name("counter")
	use.styles(cssReset, styles)

	const $count = use.signal(start)
	const increment = () => { $count.value += step }

	return html`
		<slot></slot>
		<div>
			<span>${$count()}</span>
		</div>
		<div>
			<button @click="${increment}">++</button>
		</div>
	`
})

// convert a view into a web component
export class CounterComponent extends (
	CounterView
		.component(class extends BaseElement {
			attrs = dom.attrs(this).spec({
				start: Number,
				step: Number,
			})
		})
		.props(c => [c.attrs.start ?? 0, c.attrs.step ?? 1])
) {}

const styles = css`
:host {
	display: flex;
	justify-content: center;
	gap: 1em;
}

button {
	padding: 0.2em 0.5em;
}
`

