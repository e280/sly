import {AsyncDirective, directive, DirectiveResult} from "lit/async-directive.js"
import {ViewFn} from "../../types.js"
import {ViewCapsule} from "./capsule.js"
import {ViewContext} from "./context.js"

export function makeViewDirective<Props extends any[]>(
		viewFn: ViewFn<Props>,
		settings: ShadowRootInit,
	) {

	return directive (class ViewDirective extends AsyncDirective {
		#capsule = new ViewCapsule(settings, viewFn)

		render(context: ViewContext<Props>) {
			this.#capsule.updateContext(context)
			this.#capsule.renderNow()
			return this.#capsule.element
		}

		disconnected() {
			this.#capsule.disconnected()
		}

		reconnected() {
			this.#capsule.reconnected()
		}
	}) as (context: ViewContext<Props>) => DirectiveResult
}

