
import {Constructor} from "@e280/stz"
import {ViewFn} from "../types.js"
import {Use} from "../units/use.js"
import {mkView} from "./make-view.js"
import {Reactor} from "./utils/reactor.js"
import {BaseElement} from "../units/base-element.js"

export function mkComponent<B extends Constructor<BaseElement>, Props extends any[]>(
		settings: ShadowRootInit,
		Base: B,
		propFn: (component: InstanceType<B>) => Props,
		viewFn: ViewFn<Props>,
	) {

	return class Component extends Base {
		static view = mkView(viewFn, settings)
		#reactor = new Reactor()
		shadowize() {
			return this.attachShadow(settings)
		}
		render(use: Use) {
			return viewFn(use)(...this.#reactor.effect(
				() => propFn(this as any),
				() => this.update(),
			))
		}
	}
}

