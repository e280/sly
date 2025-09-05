
import {css, html} from "lit"
import {nap, repeat} from "@e280/stz"

import {Use} from "../../views/use.js"
import {attributes} from "../../views/attributes.js"
import {BaseElement} from "../../views/base-element.js"

export class IncrediElement extends BaseElement {
	styles = css`:host {color: orange;}`

	something = {whatever: "rofl"}
	attrs = attributes(this, {value: Number})

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

