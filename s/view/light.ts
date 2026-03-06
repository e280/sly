
import {microbounce} from "@e280/stz"

import {ContentFn} from "./types.js"
import {LightCx} from "./parts/cx.js"
import {hooks} from "./hooks/plumbing/hooks.js"
import {Reactivity} from "./parts/reactivity.js"
import {Hookscope} from "./hooks/plumbing/hookscope.js"
import {AsyncDirective, directive, Part} from "lit/async-directive.js"

export function light<Props extends any[]>(contentFn: ContentFn<Props>) {
	return directive(class D extends AsyncDirective {
		#props!: Props
		#cx = new LightCx(microbounce(() => {
			if (!this.#props) throw new Error("cannot render before props")
			if (this.isConnected) {
				const content = this.render(...this.#props)
				this.setValue(content)
				this.#cx.doneRender()
			}
		}))
		#hookscope = new Hookscope(this.#cx)
		#reactivity = new Reactivity()

		update(part: Part, props: any[]) {
			const ret = super.update(part, props)
			if (this.isConnected) this.#cx.doneRender()
			return ret
		}

		render(...props: Props) {
			this.#props = props
			return this.#reactivity.observe(
				() => hooks.wrap(this.#hookscope, () => contentFn(...this.#props)),
				this.#cx.render,
			)
		}

		disconnected() {
			this.#hookscope.mounts.unmountAll()
			this.#reactivity.clear()
		}

		reconnected() {
			this.#hookscope.mounts.remountAll()
			this.#cx.render()
		}
	}) as ContentFn<Props>
}

