
import {css, html} from "lit"
import {Op} from "../../features/op/op.js"
import {view} from "../../features/views/view.js"
import {cssReset} from "../../features/views/css-reset.js"
import {anims, makeLoader} from "../../features/op/loaders/make-loader.js"

export const LoadersView = view(use => () => {
	use.name("loaders")
	use.styles(cssReset, styles)

	const op = use.once(() => Op.loading())

	const loaders = use.once(() =>
		Object.entries(anims).map(([key, anim]) => ({
			key,
			loader: makeLoader(anim)
		}))
	)

	return loaders.map(({key, loader}) => html`
		<div data-anim="${key}">
			<span>${key}</span>
			<span>${loader(op, () => null)}</span>
		</div>
	`)
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
	align-items: center;
	gap: 0.4em;

	text-align: center;

	padding: 0.2em 0.5em;
	background: var(--pill);
	border-radius: 0.5em;

	span:nth-child(1) {
		font-size: 0.6em;
	}

	span:nth-child(2) {
		font-size: 1.2em;
		min-width: 5em;
		min-height: 1.2em;
	}
}
`

