
import {render, TemplateResult} from "lit"

export function mk<E extends Element = HTMLElement>(template: TemplateResult) {
	const fragment = document.createDocumentFragment()
	render(template, fragment)
	return fragment.firstElementChild as E
}

