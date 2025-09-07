
import {dom} from "../../dom/dom.js"

export class AttrWatcher {
	#stopper: (() => void) | undefined

	constructor(
		private element: HTMLElement,
		private response: () => void,
	) {}

	start() {
		if (!this.#stopper)
			this.#stopper = dom.attrs(this.element).on(this.response)
	}

	stop() {
		if (this.#stopper) this.#stopper()
		this.#stopper = undefined
	}
}

