
import {Content, ViewFn} from "./types.js"
import {makeView} from "./utils/make-view.js"
import {BaseElement} from "../base/element.js"
import {_disconnect, _reconnect, Use} from "../base/use.js"

export function view<Props extends any[]>(fn: ViewFn<Props>) {
	return makeView(fn, {mode: "open"})
}

view.settings = (settings: ShadowRootInit) => ({
	render: <Props extends any[]>(fn: ViewFn<Props>) => {
		return makeView(fn, settings)
	}
})

view.render = view

view.component = (fn: (use: Use) => Content) => (
	view(use => () => fn(use))
		.component(BaseElement)
		.props(() => [])
)

