
import {css, html} from "lit"
import {nap, repeat} from "@e280/stz"

import {KingView} from "./king.js"
import {DivineView} from "./divine.js"
import {view} from "../../views/view.js"
import {CounterView} from "./counter.js"
import {LoadersView} from "./loaders.js"
import {cssReset} from "../../views/css-reset.js"

export const DemoView = view(use => () => {
	use.name("demo")
	use.styles(cssReset, styles)

	const $speed = use.signal(3)

	use.mount(() => repeat(async() => {
		await nap(1000)
		$speed.value++
	}))

	return html`
		${KingView(280)}
		${CounterView.props(2).children("view").render()}
		${DivineView($speed())}
		${LoadersView()}
	`
})

const styles = css`
:host {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1em;
}
`

