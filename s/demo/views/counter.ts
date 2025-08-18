
import {css, html} from "lit"
import {repeat} from "@e280/stz"

import {view} from "../../features/views/view.js"
import {cssReset} from "../../features/views/css-reset.js"

export const CounterView = view(use => (initial: number) => {
	use.name("counter")
	use.styles(cssReset, styles)

	const start = use.once(() => Date.now())
	const seconds = use.signal(0)

	use.mount(() => repeat(async() => {
		const since = Date.now() - start
		seconds(Math.floor(since / 1000))
	}))

	const count = use.signal(initial)
	const increment = () => count(count() + 1)

	return html`
		<slot></slot>
		<div>
			<span>${seconds()}</span>
		</div>
		<div>
			<span>${count()}</span>
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

