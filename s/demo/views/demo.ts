
import {css, html} from "lit"
import {CounterView} from "./counter.js"
import {LoadersView} from "./loaders.js"
import {view} from "../../features/views/view.js"
import {cssReset} from "../../features/views/css-reset.js"

export const DemoView = view(use => () => {
	use.name("demo")
	use.styles(cssReset, styles)

	return html`
		${CounterView()}
		${LoadersView()}
	`
})

const styles = css`
:host {
	display: flex;
	flex-direction: column;
	gap: 1em;
}
`

