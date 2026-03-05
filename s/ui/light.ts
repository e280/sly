
import {tracker} from "@e280/strata"
import {microbounce} from "@e280/stz"

import {ContentFn} from "./types.js"
import {LightCx} from "./parts/cx.js"
import {Scope} from "./hooks/plumbing/scope.js"
import {station} from "./hooks/plumbing/station.js"
import {AsyncDirective, directive, Part} from "lit/async-directive.js"

export function light<Props extends any[]>(render: ContentFn<Props>) {
	return directive(class D extends AsyncDirective {
		#props!: Props
		#rerender = microbounce(() => {
			if (!this.#props) throw new Error("cannot render before props")
			if (this.isConnected) {
				const content = this.render(...this.#props)
				this.setValue(content)
				this.#cx.doneRender()
			}
		})
		#cx = new LightCx(this.#rerender)
		#scope = new Scope(this.#cx)
		#stoppers: (() => void)[] = []

		#stop() {
			this.#stoppers.forEach(stop => stop())
			this.#stoppers = []
		}

		update(part: Part, props: any[]) {
			const ret = super.update(part, props)
			if (this.isConnected) this.#cx.doneRender()
			return ret
		}

		render(...props: Props) {
			this.#props = props
			this.#stop()
			const {seen, result} = tracker.observe(() => {
				return station.wrap(this.#scope, () => render(...this.#props))
			})
			for (const item of seen) {
				const stop = tracker.subscribe(item, this.#cx.render)
				this.#stoppers.push(stop)
			}
			return result
		}

		disconnected() {
			this.#scope.mounts.unmountAll()
			this.#stop()
		}

		reconnected() {
			this.#scope.mounts.remountAll()
			this.#cx.render()
		}
	}) as ContentFn<Props>
}

