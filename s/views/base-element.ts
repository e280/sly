
import {CSSResultGroup} from "lit"
import {tracker} from "@e280/strata"
import {debounce, MapG} from "@e280/stz"

import {dom} from "../dom/dom.js"
import {Content} from "./types.js"
import {applyStyles} from "./utils/apply-styles.js"
import {Use, _disconnect, _reconnect, _wrap} from "./use.js"

export abstract class BaseElement extends HTMLElement {
	readonly #use: Use
	readonly shadow: ShadowRoot

	#mounts = 0
	#tracking = new MapG<any, () => void>

	constructor() {
		super()
		this.shadow = this.attachShadow({mode: "open"})
		this.#use = new Use(
			this,
			this.shadow,
			this.updateNow,
			this.update,
		)
	}

	abstract get styles(): CSSResultGroup
	abstract render(use: Use): Content

	updateNow = () => {
		this.#use[_wrap](() => {
			const {result, seen} = tracker.observe(() => this.render(this.#use))

			dom.render(this.shadow, result)

			for (const item of seen)
				this.#tracking.guarantee(
					item,
					() => tracker.subscribe(item, this.update),
				)
		})
	}

	update = debounce(0, this.updateNow)
	
	connectedCallback() {
		if (this.#mounts === 0) {
			applyStyles(this.shadow, this.styles)
			this.updateNow()
		}
		else
			this.#use[_reconnect]()
		this.#mounts++
	}

	disconnectedCallback() {
		this.#use[_disconnect]()
		for (const untrack of this.#tracking.values())
			untrack()
		this.#tracking.clear()
	}
}

