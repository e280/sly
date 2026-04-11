
import {css, html} from "lit"
import {newWait} from "../../wait/index.js"
import {shadow} from "../../view/shadow.js"
import {dotsSpinner, earthSpinner, spinner} from "../../spinner/index.js"
import {cssReset, useName, useOnce, useStyles} from "../../view/index.js"

export const LoadersView = shadow(() => {
	useName("loaders")
	useStyles(cssReset, styles)

	const wait = useOnce(() => newWait())

	return html`
		<div data-anim="spinner">
			<span>spinner</span>
			<span>${spinner(wait, () => null)}</span>
		</div>

		<div data-anim="dots">
			<span>dotsSpinner</span>
			<span>${dotsSpinner(wait, () => null)}</span>
		</div>

		<div data-anim="earth">
			<span>earthSpinner</span>
			<span>${earthSpinner(wait, () => null)}</span>
		</div>
	`
})

const styles = css`
:host {
	display: flex;
	flex-direction: row;
	justify-content: center;
	flex-wrap: wrap;

	gap: 0.2em;
	padding: 1em;

	width: 100%;
}

div {
	font-family: monospace;

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;

	gap: 0.4em;
	padding: 0.2em 0.5em;
	background: var(--pill);
	border-radius: 0.5em;

	span:nth-child(1) {
		font-size: 0.6em;
	}

	span:nth-child(2) {
		display: flex;
		justify-content: center;
		align-items: center;

		font-size: 1.2em;
		min-width: 7em;
		min-height: 2.5em;
	}
}
`

