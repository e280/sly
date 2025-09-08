
import {debounce} from "@e280/stz"
import {ViewFn} from "../../types.js"
import {SlyView} from "./sly-view.js"
import {dom} from "../../../dom/dom.js"
import {ViewContext} from "./context.js"
import {applyAttrs} from "./apply-attrs.js"
import {Reactor} from "../../base/utils/reactor.js"
import {AttrWatcher} from "../../base/utils/attr-watcher.js"
import {_disconnect, _reconnect, _wrap, Use} from "../../base/use.js"

/** controls the rendering of view context into an element. */
export class ViewCapsule<Props extends any[]> {
	#element = SlyView.make()
	#reactor = new Reactor()

	#use: Use
	#shadow: ShadowRoot
	#context!: ViewContext<Props>
	#attrWatcher = new AttrWatcher(this.#element, () => this.#renderDebounced())

	constructor(
			private viewFn: ViewFn<Props>,
			private settings: ShadowRootInit,
		) {
		this.#shadow = this.#element.attachShadow(this.settings)
		this.#use = new Use(
			this.#element,
			this.#shadow,
			this.#renderNow,
			this.#renderDebounced,
		)
	}

	update(context: ViewContext<Props>) {
		this.#context = context
		this.#renderNow()
		return this.#element
	}

	#renderNow = () => {
		this.#use[_wrap](() => {
			const content = this.#reactor.effect(
				() => this.viewFn(this.#use)(...this.#context.props),
				() => this.#renderDebounced(),
			)
			applyAttrs(this.#element, this.#context.attrs)
			dom.render(this.#shadow, content)
			dom.render(this.#element, this.#context.children)
			this.#attrWatcher.start()
		})
	}

	#renderDebounced = debounce(0, this.#renderNow)

	disconnected() {
		this.#use[_disconnect]()
		this.#reactor.clear()
		this.#attrWatcher.stop()
	}

	reconnected() {
		this.#use[_reconnect]()
		this.#attrWatcher.start()
	}
}

