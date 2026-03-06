
import {microbounce} from "@e280/stz"
import {render as litRender} from "lit"

import {ShadowCx} from "./parts/cx.js"
import {hooks} from "./hooks/plumbing/hooks.js"
import {SlyShadow} from "./common/sly-shadow.js"
import {Reactivity} from "./parts/reactivity.js"
import {applyAttrs} from "./parts/apply-attrs.js"
import {Hookscope} from "./hooks/plumbing/hookscope.js"
import {View, Placement, ShadowSetup, ShadowView} from "./types.js"
import {AsyncDirective, directive, PartInfo} from "lit/async-directive.js"

export function shadowSetup(): ShadowSetup {
	SlyShadow.register()
	const host = document.createElement("sly-shadow")
	const shadow = host.attachShadow({mode: "open"})
	return {host, shadow}
}

export function shadow<Props extends any[]>(view: View<Props>) {
	return rawShadow(shadowSetup, view)
}

shadow.setup = (setup: () => ShadowSetup) => (
	<Props extends any[]>(view: View<Props>) => (
		rawShadow(setup, view)
	)
)

function rawShadow<Props extends any[]>(
		setup: () => ShadowSetup,
		view: View<Props>,
	) {

	const directiveFn = directive(class extends AsyncDirective {
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
				() => hooks.wrap(this.#hookscope, () => view(...this.#props)),
				this.#cx.render,
			)
		}

		render({props, children, attrs}: Placement<Props>) {
			const {host} = this.#cx
			if (!this.isConnected) return host
			if (attrs) applyAttrs(host, attrs)
			litRender(children, this.#cx.host)
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
	}) as ShadowView<[Placement<Props>]>

	function shadowView(...props: Props) {
		return directiveFn({props})
	}

	shadowView.with = directiveFn

	return shadowView as ShadowView<Props>
}

