
import {debounce} from "@e280/stz"
import {ViewFn} from "../../types.js"
import {dom} from "../../../dom/dom.js"
import {ViewContext} from "./context.js"
import {Reactor} from "../utils/reactor.js"
import {applyAttrsMap} from "../utils/apply-attrs.js"
import {_disconnect, _reconnect, Use} from "../../units/use.js"

export class ViewCapsule<Props extends any[]> {
	#context!: ViewContext<Props>
	#element = document.createElement("sly-view")
	#reactor = new Reactor()

	#use: Use
	#shadow: ShadowRoot

	constructor(
			private settings: ShadowRootInit,
			private viewFn: ViewFn<Props>
		) {
		this.#shadow = this.#element.attachShadow(this.settings)
		this.#use = new Use(
			this.#element,
			this.#shadow,
			() => this.renderNow(),
			() => this.#renderDebounced(),
		)
	}

	updateContext(context: ViewContext<Props>) {
		this.#context = context
	}

	renderNow() {
		const content = this.#reactor.effect(
			() => this.viewFn(this.#use)(...this.#context.props),
			() => this.#renderDebounced(),
		)
		applyAttrsMap(this.#element, this.#context.attrs)
		dom.render(this.#shadow, content)
		dom.render(this.#shadow, this.#context.children)
	}

	#renderDebounced = debounce(0, this.renderNow)

	get element() {
		return this.#element
	}

	disconnected() {
		this.#use[_disconnect]()
		this.#reactor.clear()
	}

	reconnected() {
		this.#use[_reconnect]()
		// this.#attrWatcher.start()
	}
}

