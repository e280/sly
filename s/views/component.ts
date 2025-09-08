
import {Constructor, debounce, MapG} from "@e280/stz"

import {dom} from "../dom/dom.js"
import {Reactor} from "./utils/reactor.js"
import {BaseElement} from "./base-element.js"
import {AttrValue, Content} from "./types.js"
import {applyAttrsMap} from "./utils/apply-attrs.js"
import {Use, _disconnect, _reconnect, _wrap} from "./use.js"
import {AsyncDirective, directive, DirectiveResult} from "lit/async-directive.js"

export type ViewFn<Props extends any[]> = (
	(use: Use) =>
	(...props: Props) =>
	Content
)

export type ComponentClass<Props extends any[]> = {
	view: (...props: Props) => DirectiveResult
	new(): BaseElement
} & typeof BaseElement


export class SlyView extends HTMLElement {}

dom.register({SlyView}, {soft: true})

export class ViewContext<Props extends any[]> {
	attrs = new MapG<string, AttrValue>()
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

export class ViewCapsule<Props extends any[]> {
	#context!: ViewContext<Props>
	#element = document.createElement("sly-view")
	#reactor = new Reactor()

	#use: Use
	#shadow: ShadowRoot

	constructor(
			private settings: ShadowRootInit,
			private viewFn: ViewFn<Props>
		) {
		this.#shadow = this.#element.attachShadow(this.settings)
		this.#use = new Use(
			this.#element,
			this.#shadow,
			() => this.renderNow(),
			() => this.#renderDebounced(),
		)
	}

	updateContext(context: ViewContext<Props>) {
		this.#context = context
	}

	renderNow() {
		const content = this.#reactor.effect(
			() => this.viewFn(this.#use)(...this.#context.props),
			() => this.#renderDebounced(),
		)
		applyAttrsMap(this.#element, this.#context.attrs)
		dom.render(this.#shadow, content)
		dom.render(this.#shadow, this.#context.children)
	}

	#renderDebounced = debounce(0, this.renderNow)

	get element() {
		return this.#element
	}

	disconnected() {
		this.#use[_disconnect]()
		this.#reactor.clear()
	}

	reconnected() {
		this.#use[_reconnect]()
		// this.#attrWatcher.start()
	}
}

export function makeViewDirective<Props extends any[]>(
		viewFn: ViewFn<Props>,
		settings: ShadowRootInit,
	) {

	return directive (class ViewDirective extends AsyncDirective {
		#capsule = new ViewCapsule(settings, viewFn)

		render(context: ViewContext<Props>) {
			this.#capsule.updateContext(context)
			this.#capsule.renderNow()
			return this.#capsule.element
		}

		disconnected() {
			this.#capsule.disconnected()
		}

		reconnected() {
			this.#capsule.reconnected()
		}
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

	v.component = <B extends Constructor<BaseElement>>(Base: B) => ({
		props: (propFn: (component: InstanceType<B>) => Props) => (
			mkComponent<B, Props>(
				settings,
				Base,
				propFn,
				viewFn,
			)
		)
	})

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

export function view<Props extends any[]>(fn: ViewFn<Props>) {
	return mkView(fn, {mode: "open"})
}

view.settings = (settings: ShadowRootInit) => ({
	render: <Props extends any[]>(fn: ViewFn<Props>) => {
		return mkView(fn, settings)
	}
})

view.render = view

