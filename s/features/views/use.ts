
import {CSSResultGroup} from "lit"
import {applyStyles} from "./utils/apply-styles.js"

export class Use {
	#runs = 0
	static run(use: Use) { use.#runs++ }

	constructor(
		public element: HTMLElement,
		public shadow: ShadowRoot,
	) {}

	styles(...styles: CSSResultGroup[]) {
		if (this.#runs === 0) applyStyles(this.shadow, styles)
	}

	name(name: string) {
		if (this.#runs === 0) this.element.setAttribute("view", name)
	}
}

