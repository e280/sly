
import {debounce} from "@e280/stz"
import {CSSResultGroup} from "lit"

import {dom} from "../dom/dom.js"
import {Content} from "../view/types.js"
import {Reactor} from "./utils/reactor.js"
import {AttrWatcher} from "./utils/attr-watcher.js"
import {applyStyles} from "./utils/apply-styles.js"
import {Use, _disconnect, _reconnect, _wrap} from "./use.js"

export class BaseElement extends HTMLElement {
	static styles: CSSResultGroup | undefined

	readonly shadow: ShadowRoot

	#use: Use
	#mountCount = 0
	#reactor = new Reactor()
	#attrWatcher = new AttrWatcher(this, () => this.update())

	/** create the shadow root. override this if you want to change the shadow root settings. */
	createShadow() {
		return this.attachShadow({mode: "open"})
	}

	constructor() {
		super()
		this.shadow = this.createShadow()
		this.#use = new Use(
			this,
			this.shadow,
			this.updateNow,
			this.update,
		)
	}

	/** return some content to render. */
	render(_use: Use): Content {}

	/** immediately perform a fresh render into the shadow root. */
	updateNow = () => {
		this.#use[_wrap](() => {
			dom.render(
				this.shadow,
				this.#reactor.effect(
					() => this.render(this.#use),
					this.update,
				),
			)
		})
	}

	/** request a rerender which will happen soon (debounced). */
	update = debounce(0, this.updateNow)
	
	connectedCallback() {
		if (this.#mountCount === 0) {
			const styles = (this.constructor as any).styles
			if (styles) applyStyles(this.shadow, styles)
			this.updateNow()
		}
		else {
			this.#use[_reconnect]()
		}
		this.#attrWatcher.start()
		this.#mountCount++
	}

	disconnectedCallback() {
		this.#use[_disconnect]()
		this.#reactor.clear()
		this.#attrWatcher.stop()
	}
}

