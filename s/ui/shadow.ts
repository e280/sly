
import {render} from "lit"
import {tracker} from "@e280/strata"
import {microbounce} from "@e280/stz"

import {Scope} from "./hooks/plumbing/scope.js"
import {station} from "./hooks/plumbing/station.js"
import {ContentFn, ShadowCx, ShadowSetup} from "./types.js"
import {AsyncDirective, directive, PartInfo} from "lit/async-directive.js"

export function shadow<Props extends any[]>(viewFn: ContentFn<Props>) {
	const setupFn = (): ShadowSetup => {
		const host = document.createElement("div")
		const shadow = host.attachShadow({mode: "open"})
		return {host, shadow}
	}
	return rawShadow(setupFn, viewFn)
}

shadow.config = (setupFn: () => ShadowSetup) => (
	<Props extends any[]>(contentFn: ContentFn<Props>) => (
		rawShadow(setupFn, contentFn)
	)
)

const rawShadow = <Props extends any[]>(
		setup: () => ShadowSetup,
		contentFn: ContentFn<Props>,
	) => directive(class extends AsyncDirective {

	#cx
	#scope
	#props!: Props
	#stoppers: (() => void)[] = []

	#rerender = microbounce(() => {
		if (!this.#props) throw new Error("cannot render before props")
		if (this.isConnected) {
			const content = this.#renderContent(this.#props)
			render(content, this.#cx.shadow)
		}
	})

	constructor(part: PartInfo) {
		super(part)
		const {host, shadow} = setup()
		this.#cx = new ShadowCx(this.#rerender, host, shadow)
		this.#scope = new Scope(this.#cx)
	}

	#stop() {
		this.#stoppers.forEach(stop => stop())
		this.#stoppers = []
	}

	#renderContent(props: Props) {
		this.#props = props
		this.#stop()
		const {seen, result: content} = tracker.observe(() => {
			return station.wrap(this.#scope, () => contentFn(...this.#props))
		})
		for (const item of seen) {
			const stop = tracker.subscribe(item, this.#cx.render)
			this.#stoppers.push(stop)
		}
		return content
	}

	render(...props: Props) {
		const content = this.#renderContent(props)
		render(content, this.#cx.shadow)
		return this.#cx.host
	}

	disconnected() {
		this.#scope.mounts.unmountAll()
		this.#stop()
	}

	reconnected() {
		this.#scope.mounts.remountAll()
		this.#rerender()
	}
}) as ContentFn<Props>

