
import {css, html} from "lit"
import {nap, repeat} from "@e280/stz"

import {dom} from "../../dom/dom.js"
import {Use} from "../../views/use.js"
import {BaseElement} from "../../views/base-element.js"

export class IncrediElement extends BaseElement {
	static styles = css`span{color:orange}`
	attrs = dom.attrs(this).spec({value: Number})
	something = {whatever: "rofl"}

	render(use: Use) {
		const {value = 1} = this.attrs
		const $count = use.signal(0)

		use.mount(() => repeat(async() => {
			await nap(10)
			await $count($count() + 1)
		}))

		return html`
			<span>${$count() * value}</span>
		`
	}
}

