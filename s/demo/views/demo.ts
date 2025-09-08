
import {css, html} from "lit"

import {CounterView} from "./counter.js"
import {LoadersView} from "./loaders.js"
import {component} from "../../ui/component.js"
import {cssReset} from "../../ui/base/css-reset.js"

export class DemoComponent extends (component(use => {
	use.name("demo")
	use.styles(cssReset, styles)
	return html`
		${CounterView(768, 3)}
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

