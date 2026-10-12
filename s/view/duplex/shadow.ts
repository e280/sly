
import {Content} from "../types.js"
import {shadowView} from "../shadow.js"
import {shadowElement} from "../elements/shadow.js"

/** make a shadow-view and shadow-element at the same time. */
export function shadowDuplex<P extends any[]>(render: (...p: P) => Content) {
	const view = shadowView(render)
	const makeElement = (...p: P) => shadowElement(() => render(...p))

	return [view, makeElement] as [
		view: typeof view,
		makeElement: typeof makeElement,
	]
}

