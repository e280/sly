
import {Constructor} from "@e280/stz"
import {Use} from "../base/use.js"
import {makeView} from "./make-view.js"
import {BaseElement} from "../base-element.js"
import {Reactor} from "../base/utils/reactor.js"
import {ComponentClass, ViewFn} from "../types.js"

/** make a component from a BaseElement and a view. */
export function makeComponent<B extends Constructor<BaseElement>, Props extends any[]>(
		settings: ShadowRootInit,
		Base: B,
		propFn: (component: InstanceType<B>) => Props,
		viewFn: ViewFn<Props>,
	) {

	return class Component extends Base {
		static view = makeView(viewFn, settings)
		#reactor = new Reactor()

		createShadow() {
			return this.attachShadow(settings)
		}

		render(use: Use) {
			// reactor is tracking the propFn
			return viewFn(use)(...this.#reactor.effect(
				() => propFn(this as any),
				() => this.update(),
			))
		}
	} as any as ComponentClass<B, Props>
}

