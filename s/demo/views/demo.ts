
import {css, html} from "lit"
import {view} from "../../views/view.js"
import {CounterView} from "./counter.js"
import {LoadersView} from "./loaders.js"
import {cssReset} from "../../views/css-reset.js"

export const DemoView = view(use => () => {
	use.name("demo")
	use.styles(cssReset, styles)

	return html`
		${CounterView.children("view")(2)}
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

