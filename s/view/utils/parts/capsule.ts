
import {RootPart} from "lit"
import {debounce} from "@e280/stz"
import {ViewFn} from "../../types.js"
import {dom} from "../../../dom/dom.js"
import {ViewContext} from "./context.js"
import {Reactor} from "../../../base/utils/reactor.js"
import {attrSet} from "../../../dom/attrs/parts/attr-fns.js"
import {AttrWatcher} from "../../../base/utils/attr-watcher.js"
import {_disconnect, _reconnect, _wrap, Use} from "../../../base/use.js"

/** controls the rendering of view context into an element. */
export class ViewCapsule<Props extends any[]> {
	#element: HTMLElement
	#reactor = new Reactor()

	#use: Use
	#shadow: ShadowRoot
	#context!: ViewContext<Props>
	#attrWatcher: AttrWatcher
	#partShadow?: RootPart
	#partElement?: RootPart

	constructor(
			host: HTMLElement,
			private viewFn: ViewFn<Props>,
			private settings: ShadowRootInit,
		) {
		this.#element = host
		this.#shadow = this.#element.attachShadow(this.settings)
		this.#use = new Use(
			this.#element,
			this.#shadow,
			this.#renderNow,
			this.#renderDebounced,
		)
		this.#attrWatcher = new AttrWatcher(this.#element, () => this.#renderDebounced())
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
			attrSet.entries(this.#element, this.#context.attrs)
			this.#partShadow = dom.render(this.#shadow, content)
			this.#partElement = dom.render(this.#element, this.#context.children)
			this.#attrWatcher.start()
		})
	}

	#renderDebounced = debounce(0, this.#renderNow)

	disconnected() {
		this.#partShadow?.setConnected(false)
		this.#partElement?.setConnected(false)
		this.#use[_disconnect]()
		this.#reactor.clear()
		this.#attrWatcher.stop()
	}

	reconnected() {
		this.#use[_reconnect]()
		this.#attrWatcher.start()
		this.#partShadow?.setConnected(true)
		this.#partElement?.setConnected(true)
	}
}

