
import {ViewFn} from "./types.js"
import {mkView} from "./parts/make-view.js"
import {_disconnect, _reconnect} from "./units/use.js"

export function view<Props extends any[]>(fn: ViewFn<Props>) {
	return mkView(fn, {mode: "open"})
}

view.settings = (settings: ShadowRootInit) => ({
	render: <Props extends any[]>(fn: ViewFn<Props>) => {
		return mkView(fn, settings)
	}
})

view.render = view

