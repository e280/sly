
import {render} from "lit"
import {Constructor, debounce, MapG} from "@e280/stz"
import {directive} from "lit/directive.js"
import {tracker} from "@e280/strata/tracker"
import {AsyncDirective} from "lit/async-directive.js"

import {register} from "../dom/register.js"
import {applyAttrs} from "./utils/apply-attrs.js"
import {applyStyles} from "./utils/apply-styles.js"
import {Use, _wrap, _disconnect, _reconnect} from "./use.js"
import {AttrValue, ComponentFn, Content, View, ViewFn, ViewSettings, ViewContext, ViewComponent, Elmix} from "./types.js"
import { AttrWatcher } from "./utils/attr-watcher.js"

export const view = setupView({mode: "open"})
export class SlyView extends HTMLElement {}
register({SlyView}, {soft: true, upgrade: true})

function setupView(settings: ViewSettings) {
	function view<Props extends any[]>(fn: ViewFn<Props>): View<Props> {
		type Situation = {
			getElement: () => HTMLElement
			isComponent: boolean
		}

		const make = (situation: Situation) => class ViewDirective extends AsyncDirective {
			#element = situation.getElement()
			#shadow = this.#element.attachShadow(settings)
			#renderDebounced = debounce(0, () => this.#renderNow())
			#tracking = new MapG<any, () => void>
			#params!: {context: ViewContext, props: Props}

			#use = new Use(
				this.#element,
				this.#shadow,
				() => this.#renderNow(),
				this.#renderDebounced,
			)

			#fn = (() => {
				const fn2 = fn(this.#use)
				this.#element.setAttribute("view", settings.name ?? "")
				if (settings.styles) applyStyles(this.#shadow, settings.styles)
				return fn2
			})()

			#renderNow() {
				if (!this.#params) return
				if (!this.isConnected) return
				const {context, props} = this.#params

				this.#use[_wrap](() => {
					// apply html attributes
					applyAttrs(this.#element, context.attrs)

					// render the template, tracking strata items
					const {result, seen} = tracker.observe(() => this.#fn(...props))

					// inject the template
					render(result, this.#shadow)

					// reacting to changes
					for (const item of seen)
						this.#tracking.guarantee(
							item,
							() => tracker.subscribe(item, async() => this.#renderDebounced()),
						)

					// inject content into light dom
					if (!situation.isComponent)
						render(context.children, this.#element)
				})
			}

			render(context: ViewContext, props: Props) {
				this.#params = {context, props}
				this.#renderNow()
				return situation.isComponent ? null : this.#element
			}

			disconnected() {
				this.#use[_disconnect]()
				for (const untrack of this.#tracking.values())
					untrack()
				this.#tracking.clear()
			}

			reconnected() {
				this.#use[_reconnect]()
			}
		}

		const d = directive(make({
			getElement: () => document.createElement(settings.tag ?? "sly-view"),
			isComponent: false,
		}))

		const freshViewContext = (): ViewContext => ({attrs: {}, children: []})
	
		function rendy(...props: Props) {
			return d(freshViewContext(), props)
		}

		rendy.props = (...props: Props) => {
			let ctx = freshViewContext()
			const chain = {
				children(...children: Content[]) {
					ctx = {...ctx, children: [...ctx.children, ...children]}
					return chain
				},
				attrs(attrs: Record<string, AttrValue>) {
					ctx = {...ctx, attrs: {...ctx.attrs, ...attrs}}
					return chain
				},
				attr(name: string, value: AttrValue) {
					ctx = {...ctx, attrs: {...ctx.attrs, [name]: value}}
					return chain
				},
				render() {
					return d(ctx, props)
				},
			}
			return chain
		}

		rendy.component = <El extends Partial<ViewComponent>>(fn: (el: El) => Props) => {
			return class VComponent extends HTMLElement implements ViewComponent {
				#context = freshViewContext()
				#directive = directive(
					make({
						getElement: () => this,
						isComponent: true,
					})
				)
				#attrWatcher = new AttrWatcher(this, () => this.render())
				connectedCallback() {
					this.#attrWatcher.start()
					this.renderNow()
				}
				disconnectedCallback() {
					this.#attrWatcher.stop()
				}
				render = debounce(0, () => this.renderNow())
				renderNow() {
					if (this.isConnected) {
						const props = fn(this as any)
						render(this.#directive(this.#context, props), this)
					}
				}
			} as any as (Constructor<El> & typeof HTMLElement)
		}

		return rendy
	}

	view.declare = view
	view.settings = (settings2: Partial<ViewSettings>) => setupView({...settings, ...settings2})
	view.component = <Mix extends Partial<ViewComponent>>() => ({
		props: <Props extends any[]>(elfn: (el: Elmix<Mix>) => Props) => ({
			declare: (fn: ViewFn<Props>) => view(fn).component(elfn)
		}),
	})
	return view
}

