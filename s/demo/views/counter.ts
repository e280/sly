
import {css, html} from "lit"
import {repeat} from "@e280/stz"

import {dom} from "../../dom/dom.js"
import {view} from "../../views/view.js"
import {cssReset} from "../../views/base/css-reset.js"

export const CounterView = view(use => (start: number) => {
	use.name("counter")
	use.styles(cssReset, styles)

	const $seconds = use.signal(0)
	const since = use.once(() => Date.now())
	use.mount(() => repeat(async() => {
		const delta = Date.now() - since
		$seconds.set(Math.floor(delta / 1000))
	}))

	const $count = use.signal(start)
	const increment = () => $count.value++

	const $product = use.signal
		.derived(() => $count() * $seconds())

	return html`
		<slot></slot>
		<div>
			<span>${$seconds.get()}</span>
		</div>
		<div>
			<span>${$count.get()}</span>
		</div>
		<div>
			<span>${$product.get()}</span>
		</div>
		<div>
			<button @click="${increment}">+</button>
		</div>
	`
})

// convert a view into a web component
export class CounterComponent extends (
	CounterView
		.component<{start?: number}>()
		.props(c => [dom.attrs(c).number.start ?? 0])
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

