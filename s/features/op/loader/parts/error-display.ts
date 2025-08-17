
import {css, html} from "lit"
import {view} from "../../../views/view.js"
import {cssReset} from "../../../views/css-reset.js"

const style = css`
:host {
	font-family: monospace;
	color: red;
}
`

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

