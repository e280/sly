
import {css, html} from "lit"
import {repeat} from "@e280/stz"

import {view} from "../../views/view.js"
import {cssReset} from "../../views/css-reset.js"

export const CounterView = view(use => (initial: number) => {
	use.name("counter")
	use.styles(cssReset, styles)

	const $seconds = use.signal(0)
	const start = use.once(() => Date.now())
	use.mount(() => repeat(async() => {
		const since = Date.now() - start
		$seconds.set(Math.floor(since / 1000))
	}))

	const $count = use.signal(initial)
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

