
import {Constructor, debounce, MapG} from "@e280/stz"

import {dom} from "../dom/dom.js"
import {Content} from "./types.js"
import {Reactor} from "./utils/reactor.js"
import {BaseElement} from "./base-element.js"
import {Use, _disconnect, _reconnect, _wrap} from "./use.js"
import {AsyncDirective, directive, DirectiveResult} from "lit/async-directive.js"

export type ViewFn<Props extends any[]> = (use: Use) => (this: void, ...props: Props) => Content

export type ComponentClass<Props extends any[]> = {
	view: (...props: Props) => DirectiveResult
	new(): BaseElement
} & typeof BaseElement


export class SlyView extends HTMLElement {}
dom.register({SlyView}, {soft: true})

export const componentize = (settings: ShadowRootInit = {mode: "open"}) => ({
	base: <B extends Constructor<BaseElement>>(Base: B) => ({
		props: <Props extends any[]>(propFn: (component: InstanceType<B>) => Props) => ({
			render: (viewFn: ViewFn<Props>) => mkComponent(
				settings,
				Base,
				propFn,
				viewFn,
			)
		})
	})
})

export class ViewContext<Props extends any[]> {
	attrs = new MapG<string, string | undefined>()
	children: Content[] = []
	constructor(public props: Props) {}
}

export class ViewChain<Props extends any[]> {
	#render: (context: ViewContext<Props>) => DirectiveResult
	#context: ViewContext<Props>

	constructor(
			context: ViewContext<Props>,
			render: (context: ViewContext<Props>) => DirectiveResult,
		) {
		this.#context = context
		this.#render = render
	}

	attr(key: string, value: string | undefined) {
		this.#context.attrs.set(key, value)
		return this
	}

	children(...contents: Content[]) {
		this.#context.children.push(...contents)
		return this
	}

	render() {
		return this.#render(this.#context)
	}
}

// export class ViewCapsule {
// 	#element = document.createElement("sly-view")
// 	#use: Use
// 	#shadow: ShadowRoot
// 	#reactor = new Reactor()
//
// 	constructor(
// 			private settings: ShadowRootInit,
// 			private executeRender: () => Content,
// 		) {
// 		this.#shadow = this.#element.attachShadow(this.settings)
// 		this.#use = new Use(
// 			this.#element,
// 			this.#shadow,
// 			() => this.#renderNow(),
// 			() => this.#renderDebounced(),
// 		)
// 	}
//
// 	#renderNow() {
// 		const content = this.#reactor.effect(
// 			() => this.executeRender(),
// 			() => this.#renderDebounced(),
// 		)
// 		dom.render(this.#shadow, content)
// 	}
//
// 	#renderDebounced = debounce(0, this.#renderNow)
// }

export function makeViewDirective<Props extends any[]>(
		viewFn: ViewFn<Props>,
		settings: ShadowRootInit,
	) {

	return directive (class ViewDirective extends AsyncDirective {
		#context!: ViewContext<Props>
		#element = document.createElement("sly-view")
		#shadow = this.#element.attachShadow(settings)
		#reactor = new Reactor()
		#use = new Use(
			this.#element,
			this.#shadow,
			() => this.#renderNow(),
			() => this.#renderDebounced(),
		)
		#fn = viewFn(this.#use)

		render(context: ViewContext<Props>) {
			this.#context = context
			this.#applyAttrs()
			this.#renderNow()
			return this.#element
		}

		disconnected() {
			this.#use[_disconnect]()
			this.#reactor.clear()
			// this.#attrWatcher.stop()
		}

		reconnected() {
			this.#use[_reconnect]()
			// this.#attrWatcher.start()
		}

		#applyAttrs() {
			for (const [key, value] of this.#context.attrs) {
				if (value !== undefined) this.#element.setAttribute(key, value)
				else this.#element.removeAttribute(key)
			}
		}

		#renderNow() {
			const content = this.#reactor.effect(
				() => this.#fn(...this.#context.props),
				() => this.#renderDebounced(),
			)
			dom.render(this.#shadow, content)
			dom.render(this.#element, this.#context.children)
		}

		#renderDebounced = debounce(0, this.#renderNow)
	}) as (context: ViewContext<Props>) => DirectiveResult
}

export function mkView<Props extends any[]>(viewFn: ViewFn<Props>, settings: ShadowRootInit) {
	const render = makeViewDirective(viewFn, settings)

	function v(...props: Props): DirectiveResult {
		return render(new ViewContext(props))
	}

	v.props = (...props: Props) => new ViewChain(
		new ViewContext(props),
		render,
	)

	return v
}

export function mkComponent<B extends Constructor<BaseElement>, Props extends any[]>(
		settings: ShadowRootInit,
		Base: B,
		propFn: (component: InstanceType<B>) => Props,
		viewFn: ViewFn<Props>,
	) {

	return class Component extends Base {
		static view = mkView(viewFn, settings)
		#reactor = new Reactor()
		shadowize() {
			return this.attachShadow(settings)
		}
		render(use: Use) {
			return viewFn(use)(...this.#reactor.effect(
				() => propFn(this as any),
				() => this.update(),
			))
		}
	}
}

