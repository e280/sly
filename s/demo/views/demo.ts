
import {css, html} from "lit"
import {LoadersView} from "./loaders.js"
import {CounterLight} from "./counter-light.js"
import {CounterShadow} from "./counter-shadow.js"
import {cssReset, shadow, useName, useStyles} from "../../view/index.js"

export const Demo = shadow(() => {
	useName("demo")
	useStyles(cssReset, styles)

	return html`
		<p>light ${CounterLight(123)}</p>

		<p>
			shadow ${CounterShadow.with({
				props: [234],
				attrs: {"data-lol": 555},
				children: html`<p>hello</p>`,
			})}
		</p>

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

