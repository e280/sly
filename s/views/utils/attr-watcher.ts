
import {onAttrChange} from "../../dom/attributes.js"

export class AttrWatcher {
	#stopper: (() => void) | undefined

	constructor(
		private element: HTMLElement,
		private response: () => void,
	) {}

	start() {
		if (this.#stopper) this.#stopper()
		this.#stopper = onAttrChange(this.element, this.response)
	}

	stop() {
		if (this.#stopper) this.#stopper()
		this.#stopper = undefined
	}
}

