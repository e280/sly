
import {css, html} from "lit"
import {view} from "../../ui/view.js"
import {cssReset} from "../../ui/base/css-reset.js"

export const ErrorDisplay = view(use => (error: any) => {
	use.name("error")
	use.styles(cssReset, style)

	if (typeof error === "string")
		return error

	else if (error instanceof Error)
		return html`<strong>${error.name}:</strong> <span>${error.message}</span>`

	else
		return `error`
})

const style = css`
:host {
	font-family: monospace;
	color: red;
}
`

