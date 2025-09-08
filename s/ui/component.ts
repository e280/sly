
import {view} from "./view.js"
import {Use} from "./base/use.js"
import {Content} from "./types.js"
import {BaseElement} from "./base-element.js"

export function component(fn: (use: Use) => Content) {
	return view(use => () => fn(use))
		.component(BaseElement)
		.props(() => [])
}

