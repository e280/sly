
import {debounce} from "@e280/stz"
import {CSSResultGroup} from "lit"

import {dom} from "../../dom/dom.js"
import {Content} from "../types.js"
import {Reactor} from "./utils/reactor.js"
import {AttrWatcher} from "./utils/attr-watcher.js"
import {applyStyles} from "./utils/apply-styles.js"
import {Use, _disconnect, _reconnect, _wrap} from "./use.js"

export class BaseElement extends HTMLElement {
	static styles: CSSResultGroup | undefined
	readonly shadow: ShadowRoot

	#use: Use
	#mounts = 0
	#reactor = new Reactor()
	#attrWatcher = new AttrWatcher(this, () => this.update())

	shadowize() {
		return this.attachShadow({mode: "open"})
	}

	constructor() {
		super()
		this.shadow = this.shadowize()
		this.#use = new Use(
			this,
			this.shadow,
			this.updateNow,
			this.update,
		)
	}

	render(_use: Use): Content {}

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

	update = debounce(0, this.updateNow)
	
	connectedCallback() {
		if (this.#mounts === 0) {
			const styles = (this.constructor as any).styles
			if (styles)
				applyStyles(this.shadow, styles)
			this.updateNow()
		}
		else {
			this.#use[_reconnect]()
		}
		this.#attrWatcher.start()
		this.#mounts++
	}

	disconnectedCallback() {
		this.#use[_disconnect]()
		this.#reactor.clear()
		this.#attrWatcher.stop()
	}
}

