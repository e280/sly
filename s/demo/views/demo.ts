
import {css, html} from "lit"
import {view} from "../../views/view.js"
import {CounterView} from "./counter.js"
import {LoadersView} from "./loaders.js"
import {BackwardsView} from "./backwards.js"
import {cssReset} from "../../views/css-reset.js"

export const DemoView = view(use => () => {
	use.name("demo")
	use.styles(cssReset, styles)

	return html`
		${CounterView.props(2).children("view").render()}
		${BackwardsView(3)}
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

