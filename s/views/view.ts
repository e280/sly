
import {ViewFn} from "./types.js"
import {makeView} from "./view/make-view.js"
import {_disconnect, _reconnect} from "./base/use.js"

export function view<Props extends any[]>(fn: ViewFn<Props>) {
	return makeView(fn, {mode: "open"})
}

view.settings = (settings: ShadowRootInit) => ({
	render: <Props extends any[]>(fn: ViewFn<Props>) => {
		return makeView(fn, settings)
	}
})

view.render = view

