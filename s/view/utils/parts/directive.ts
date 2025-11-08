
import {AsyncDirective, directive, DirectiveResult} from "lit/async-directive.js"

import {SlyView} from "./sly-view.js"
import {ViewFn} from "../../types.js"
import {ViewCapsule} from "./capsule.js"
import {ViewContext} from "./context.js"

/** creates a lit directive fn, which when called, emits a funky lit thing to inject in your html templates. */
export function makeViewDirective<Props extends any[]>(
		viewFn: ViewFn<Props>,
		settings: ShadowRootInit,
	) {

	return directive(class ViewDirective extends AsyncDirective {
		#host = SlyView.make()
		#capsule = new ViewCapsule(this.#host, viewFn, settings)

		render(context: ViewContext<Props>) {
			return this.#capsule.update(context)
		}

		disconnected() {
			this.#capsule.disconnected()
		}

		reconnected() {
			this.#capsule.reconnected()
		}
	}) as (context: ViewContext<Props>) => DirectiveResult
}

