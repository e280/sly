
import {ViewFn} from "./types.js"
import {mkView} from "./view/make-view.js"
import {_disconnect, _reconnect} from "./base/use.js"

export function view<Props extends any[]>(fn: ViewFn<Props>) {
	return mkView(fn, {mode: "open"})
}

view.settings = (settings: ShadowRootInit) => ({
	render: <Props extends any[]>(fn: ViewFn<Props>) => {
		return mkView(fn, settings)
	}
})

view.render = view

