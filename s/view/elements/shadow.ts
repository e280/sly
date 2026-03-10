
import {microbounce} from "@e280/stz"
import {render as litRender} from "lit"
import {Content} from "../types.js"
import {ShadowCx} from "../parts/cx.js"
import {hooks} from "../hooks/plumbing/hooks.js"
import {Reactivity} from "../parts/reactivity.js"
import {Hookscope} from "../hooks/plumbing/hookscope.js"

export function shadowElement(view: () => Content) {
	return class extends HTMLElement {
		#cx
		#hookscope
		#reactivity = new Reactivity()
		#shadow = this.attachShadow({mode: "open"})

		constructor() {
			super()
			const rerender = microbounce(() => {
				if (!this.isConnected) return
				const content = this.#renderContent()
				litRender(content, this.#cx.shadow)
				this.#cx.doneRender()
			})
			this.#cx = new ShadowCx(rerender, this, this.#shadow)
			this.#hookscope = new Hookscope(this.#cx)
		}

		#renderContent() {
			return this.#reactivity.observe(
				() => hooks.wrap(this.#hookscope, () => view()),
				this.#cx.render,
			)
		}

		render() {
			litRender(this.#renderContent(), this.#cx.shadow)
			this.#cx.doneRender()
		}

		connectedCallback() {
			this.#hookscope.mounts.remountAll()
			this.#cx.render()
		}

		disconnectedCallback() {
			this.#hookscope.mounts.unmountAll()
			this.#reactivity.clear()
		}
	}
}

