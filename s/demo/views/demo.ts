
import {css, html} from "lit"

import {view} from "../../view/view.js"
import {CounterView} from "./counter.js"
import {LoadersView} from "./loaders.js"
import {MountingTest} from "./mounting.js"
import {CounterLight} from "./counter-light.js"
import {cssReset} from "../../base/css-reset.js"
import {CounterShadow} from "./counter-shadow.js"

export class DemoComponent extends (view.component(use => {
	use.name("demo")
	use.styles(cssReset, styles)

	return html`
		${MountingTest()}

		<div>
			<span>new light view:</span>
			${CounterLight(123)}
		</div>

		<div>
			<span>new shadow view:</span>
			${CounterShadow.with({
				props: [234],
				attrs: {"data-lol": 555},
				children: html`<p>hello</p>`,
			})}
		</div>

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

