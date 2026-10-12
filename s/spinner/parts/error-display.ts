
import {css, html} from "lit"
import {shadowView} from "../../view/shadow.js"
import {cssReset, useName, useStyles} from "../../view/index.js"

export const ErrorDisplay = shadowView((error: any) => {
	useName("error")
	useStyles(cssReset, style)

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

