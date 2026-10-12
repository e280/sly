
import {Content} from "../types.js"
import {lightView} from "../light.js"
import {lightElement} from "../elements/light.js"

/** make a light-view and light-element at the same time. */
export function lightDuplex<P extends any[]>(render: (...p: P) => Content) {
	const view = lightView(render)
	const makeElement = (...p: P) => lightElement(() => render(...p))

	return [view, makeElement] as [
		view: typeof view,
		makeElement: typeof makeElement,
	]
}

