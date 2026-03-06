
import {debounce} from "@e280/stz"
import {ViewFn} from "../../types.js"
import {dom} from "../../../dom/dom.js"
import {AttrValue} from "../../../dom/types.js"
import {Reactor} from "../../../base/utils/reactor.js"
import {attrSet} from "../../../dom/attrs/parts/attr-fns.js"
import {AttrWatcher} from "../../../base/utils/attr-watcher.js"
import {_disconnect, _reconnect, _wrap, Use} from "../../../base/use.js"

/** the information we need to render a view. */
export class NakedContext<Props extends any[]> {
	attrs = new Map<string, AttrValue>()
	constructor(public props: Props) {}
}

/** controls the rendering of view context into an element. */
export class NakedCapsule<Props extends any[]> {
	#element: HTMLElement
	#reactor = new Reactor()

	#use: Use
	#shadow: ShadowRoot
	#context!: NakedContext<Props>
	#attrWatcher: AttrWatcher

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

	update(context: NakedContext<Props>) {
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
			dom.render(this.#shadow, content)
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

