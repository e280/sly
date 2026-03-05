
import {tracker} from "@e280/strata"
import {microbounce} from "@e280/stz"

import {RenderFn, Viewy} from "./types.js"
import {Scope} from "./hooks/plumbing/scope.js"
import {station} from "./hooks/plumbing/station.js"
import {AsyncDirective, directive} from "lit/async-directive.js"

export function light<Props extends any[]>(render: RenderFn<Props>) {
	return directive(class D extends AsyncDirective {
		#props!: Props
		#view: Viewy = {
			render: microbounce(() => {
				if (!this.#props) throw new Error("cannot render before props")
				if (this.isConnected) {
					const content = this.render(...this.#props)
					this.setValue(content)
				}
			}),
		}
		#scope = new Scope(this.#view)
		#stoppers: (() => void)[] = []

		#stop() {
			this.#stoppers.forEach(stop => stop())
			this.#stoppers = []
		}

		render(...props: Props) {
			this.#props = props
			this.#stop()
			const {seen, result} = tracker.observe(() => {
				return station.wrap(this.#scope, () => render(...this.#props))
			})
			for (const item of seen) {
				const stop = tracker.subscribe(item, this.#view.render)
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
			this.#view.render()
		}
	}) as RenderFn<Props>
}

