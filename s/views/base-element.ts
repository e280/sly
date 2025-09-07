
import {CSSResultGroup} from "lit"
import {tracker} from "@e280/strata"
import {debounce, MapG} from "@e280/stz"

import {dom} from "../dom/dom.js"
import {Content} from "./types.js"
import {AttrWatcher} from "./utils/attr-watcher.js"
import {applyStyles} from "./utils/apply-styles.js"
import {Use, _disconnect, _reconnect, _wrap} from "./use.js"

export abstract class BaseElement extends HTMLElement {
	static styles: CSSResultGroup | undefined
	readonly shadow: ShadowRoot

	#use: Use
	#mounts = 0
	#tracking = new MapG<any, () => void>
	#attrWatcher = new AttrWatcher(this, () => this.update())

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
		this.#attrWatcher.stop()
		this.#use[_disconnect]()
		for (const untrack of this.#tracking.values())
			untrack()
		this.#tracking.clear()
	}
}

