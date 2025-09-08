
import {debounce} from "@e280/stz"
import {ViewFn} from "../../types.js"
import {dom} from "../../../dom/dom.js"
import {ViewContext} from "./context.js"
import {Reactor} from "../../base/utils/reactor.js"
import {applyAttrs} from "../utils/apply-attrs.js"
import {_disconnect, _reconnect, Use} from "../../base/use.js"

export class ViewCapsule<Props extends any[]> {
	#element = document.createElement("sly-view")
	#reactor = new Reactor()

	#use: Use
	#shadow: ShadowRoot
	#context!: ViewContext<Props>

	constructor(
			private viewFn: ViewFn<Props>,
			private settings: ShadowRootInit,
		) {
		this.#shadow = this.#element.attachShadow(this.settings)
		this.#use = new Use(
			this.#element,
			this.#shadow,
			() => this.#renderNow(),
			() => this.#renderDebounced(),
		)
	}

	update(context: ViewContext<Props>) {
		this.#context = context
		this.#renderNow()
		return this.#element
	}

	#renderNow() {
		const content = this.#reactor.effect(
			() => this.viewFn(this.#use)(...this.#context.props),
			() => this.#renderDebounced(),
		)
		applyAttrs(this.#element, this.#context.attrs)
		dom.render(this.#shadow, content)
		dom.render(this.#shadow, this.#context.children)
	}

	#renderDebounced = debounce(0, this.#renderNow)

	disconnected() {
		this.#use[_disconnect]()
		this.#reactor.clear()
	}

	reconnected() {
		this.#use[_reconnect]()
		// this.#attrWatcher.start()
	}
}

