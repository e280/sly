
import {css, html} from "lit"

import {view} from "../../view/view.js"
import {CounterView} from "./counter.js"
import {LoadersView} from "./loaders.js"
import {MountingTest} from "./mounting.js"
import {cssReset} from "../../base/css-reset.js"

export class DemoComponent extends (view.component(use => {
	use.name("demo")
	use.styles(cssReset, styles)

	return html`
		${MountingTest()}

		${CounterView
			.props(768, 3)
			.children("view")
			.render()}

		${LoadersView()}
	`
})) {}

const styles = css`
:host {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1em;
}
`

