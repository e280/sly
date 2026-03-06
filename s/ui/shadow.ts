
import {microbounce} from "@e280/stz"
import {render as litRender} from "lit"

import {ShadowCx} from "./parts/cx.js"
import {hooks} from "./hooks/plumbing/hooks.js"
import {Reactivity} from "./parts/reactivity.js"
import {ContentFn, ShadowSetup} from "./types.js"
import {Hookscope} from "./hooks/plumbing/hookscope.js"
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
	#hookscope
	#props!: Props
	#reactivity = new Reactivity()

	constructor(part: PartInfo) {
		super(part)
		const {host, shadow} = setup()
		const rerender = microbounce(() => {
			if (!this.#props) throw new Error("cannot render before props")
			if (!this.isConnected) return
			const content = this.#renderContent(this.#props)
			litRender(content, this.#cx.shadow)
			this.#cx.doneRender()
		})
		this.#cx = new ShadowCx(rerender, host, shadow)
		this.#hookscope = new Hookscope(this.#cx)
	}

	#renderContent(props: Props) {
		this.#props = props
		return this.#reactivity.observe(
			() => hooks.wrap(this.#hookscope, () => contentFn(...this.#props)),
			this.#cx.render,
		)
	}

	render(...props: Props) {
		const {host} = this.#cx
		if (!this.isConnected) return host
		litRender(this.#renderContent(props), this.#cx.shadow)
		this.#cx.doneRender()
		return host
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

