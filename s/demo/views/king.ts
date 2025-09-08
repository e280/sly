
import {html} from "lit"
import {dom} from "../../dom/dom.js"
import { view } from "../../views2/view.js"
import { BaseElement } from "../../views2/base/base-element.js"

// starting as view
export const QueenView = view(use => (start: number) => {
	const $count = use.signal(start)
	const increment = () => $count($count() + 1)
	return html`
		<span>QUEEN ${$count()}</span>
		<button @click="${increment}">++</button>
	`
})

// convert to component
export class QueenComponent extends (
	QueenView
		.component(BaseElement)
		.props(() => [1])
) {}

//------------------------------

// starting as component
export class KingComponent extends (
	view(use => (start: number) => {
		const $count = use.signal(start)
		const increment = () => $count($count() + 1)
		return html`
			<span>${$count()}</span>
			<button @click="${increment}">++</button>
		`
	})
	.component(class extends BaseElement {
		attrs = dom.attrs(this).spec({start: Number})
	})
	.props(el => [el.attrs.start ?? 0])
) {}

// obtain as view
export const KingView = KingComponent.view

//------------------------------

// start as component, supply shadow settings
export class BishopComponent extends (view
	.settings({mode: "open"})
	.render(use => (start: number) => {
		const $count = use.signal(start)
		const increment = () => $count($count() + 1)
		return html`
			<span>${$count()}</span>
			<button @click="${increment}">++</button>
		`
	})
	.component(class extends BaseElement {
		attrs = dom.attrs(this).spec({start: Number})
	})
	.props(el => [el.attrs.start ?? 0])
) {}

// obtain as view
export const BishopView = BishopComponent.view

