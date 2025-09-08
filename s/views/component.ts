
import {Constructor, debounce} from "@e280/stz"
import {CSSResultGroup, html} from "lit"

import {dom} from "../dom/dom.js"
import {Reactor} from "./utils/reactor.js"
import {AsyncDirective, directive, DirectiveResult, PartInfo} from "lit/async-directive.js"
import {BaseElement} from "./base-element.js"
import {Content} from "./types.js"
import {Use, _disconnect, _reconnect, _wrap} from "./use.js"

export type ViewFn<Props extends any[]> = (use: Use) => (this: void, ...props: Props) => Content

export class SlyView extends BaseElement {}
dom.register({SlyView}, {soft: true})

export const componentize = () => ({
	base: <B extends Constructor<BaseElement>>(Base: B) => ({
		props: <Props extends any[]>(propFn: (component: InstanceType<B>) => Props) => ({
			render: (viewFn: ViewFn<Props>) => mkComponent(
				Base,
				propFn,
				viewFn,
			)
		})
	})
})

export function mkComponent<B extends Constructor<BaseElement>, Props extends any[]>(
		Base: B,
		propFn: (component: InstanceType<B>) => Props,
		viewFn: ViewFn<Props>,
	) {

	class ViewDirective extends AsyncDirective {
		#props!: Props

		#element = (() => {
			const element = new SlyView()
			element.render = use => viewFn(use)(...this.#props)
			return element
		})()

		render(...props: Props) {
			this.#props = props
			return this.#element
		}
	}

	return class Component extends Base {
		static view = directive(ViewDirective)
		#reactor = new Reactor()
		render(use: Use) {
			return viewFn(use)(...this.#reactor.effect(
				() => propFn(this as any),
				() => this.update(),
			))
		}
	} as any as ComponentClass<Props>
}

export type ComponentClass<Props extends any[]> = {
	view: (...props: Props) => DirectiveResult
	new(): BaseElement
} & typeof BaseElement

// export function viewize<Props extends any[]>(C: Constructor<Component<Props>>) {
// 	const fn = C.prototype.fn.bind(null) as ViewFn<Props>
//
// 	class ViewDirective extends AsyncDirective {
// 		#props!: Props
// 		#element = (() => {
// 			const element = new SlyView()
// 			element.actuate = use => fn(use)(...this.#props)
// 			return element
// 		})()
//
// 		render(...props: Props) {
// 			this.#props = props
// 			this.#element.updateNow()
// 			console.log("RENDERED VIEW")
// 			return this.#element
// 		}
// 	}
//
// 	return directive(ViewDirective) as (...props: Props) => DirectiveResult
// }






// export class SlyView extends BaseElement {
// 	actuate!: (use: Use) => Content
// 	render(use: Use) { this.actuate(use) }
// }
//
// dom.register({SlyView}, {soft: true})



		//
		// render(props: Props) {
		// 	this.isConnected
		// 	this.#component.connectedCallback()
		// 	this.#component.updateNow()
		// 	return this.#
		// }
		//
		// disconnected() {
		// 	this.#component.disconnectedCallback()
		// 	this.#use[_disconnect]()
		// }
		//
		// reconnected() {
		// 	this.#use[_reconnect]()
		// }







// type IVC<Props extends any[]> = Constructor<{
// 	props(): Props
// 	fn: ViewRenderFn<Props>
// 	render(use: Use): Content
// } & ViewComponent<Props>>
//
// // TODO
// export function viewize<Props extends any[]>(
// 		C: Constructor<ViewComponent<Props>>,
// 	) {
//
// 	class AugmentedComponent extends (C as IVC<Props>) {
// 		directProps!: Props
// 		props() { return this.directProps }
// 	}
//
// 	class ViewDirective extends AsyncDirective {
// 		#component = new AugmentedComponent()
// 		#reactor = new Reactor()
//
// 		render(props: Props) {
// 			this.#component.directProps = props
// 			this.#component.updateNow()
// 			return this.#component
// 		}
// 	}
// }
//
//
//
//
//
//
//
// export const toView = <C extends Component>(C: Constructor<C>) => ({
// 	fromProps: <Props extends any[]>(
// 		fn: (component: C) => (...props: Props) => void
// 	) => viewForComponent<C, Props>(C, fn),
// })
//
// function viewForComponent<C extends Component, Props extends any[]>(
// 		C: Constructor<C>,
// 		fn: (component: C) => (...props: Props) => void,
// 	) {
// }
//
// export function makeViewComponent<Props extends any[]>(
// 		fn: ViewRenderFn<Props>
// 	) {
// 	abstract class ViewComponent extends Component {
// 		abstract props(): Props
// 		render(use: Use) { return fn(use)(...this.props()) }
// 	}
// 	return ViewComponent
// }
//
// export class RoflComponent extends makeViewComponent(
// 	use => () => "html"
// ) {}
//
