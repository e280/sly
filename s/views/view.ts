
import {render} from "lit"
import {debounce, MapG} from "@e280/stz"
import {directive} from "lit/directive.js"
import {tracker} from "@e280/strata/tracker"
import {AsyncDirective} from "lit/async-directive.js"

import {register} from "../dom/parts/register.js"
import {applyAttrs} from "./utils/apply-attrs.js"
import {AttrWatcher} from "./utils/attr-watcher.js"
import {applyStyles} from "./utils/apply-styles.js"
import {Use, _wrap, _disconnect, _reconnect} from "./use.js"
import {AttrValue, Content, View, ViewRenderFn, ViewSettings, ViewContext, ViewComponent, ViewComponentClass} from "./types.js"

export const view = setupView({mode: "open"})
export class SlyView extends HTMLElement {}
register({SlyView}, {soft: true, upgrade: true})

function setupView(settings: ViewSettings) {
	function view<Props extends any[]>(fn: ViewRenderFn<Props>): View<Props> {
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
			#attrWatcher = new AttrWatcher(this.#element, () => {
				const is_view_responsible_for_rerendering = (
					!situation.isComponent
				)
				if (is_view_responsible_for_rerendering)
					this.#renderDebounced()
			})

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
				this.#attrWatcher.start()
				return situation.isComponent
					? null
					: this.#element
			}

			disconnected() {
				this.#use[_disconnect]()
				for (const untrack of this.#tracking.values())
					untrack()
				this.#tracking.clear()
				this.#attrWatcher.stop()
			}

			reconnected() {
				this.#use[_reconnect]()
				this.#attrWatcher.start()
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

		rendy.component = <Mix extends {} = {}>(fn: (el: Mix) => Props) => {
			return class VComponent extends HTMLElement implements ViewComponent {
				static view = rendy
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
			} as any as ViewComponentClass<Mix, Props>
		}

		return rendy
	}

	view.render = view
	view.settings = (settings2: Partial<ViewSettings>) => setupView({...settings, ...settings2})
	view.component = <Mix extends {}>() => ({
		props: <Props extends any[]>(elfn: (el: ViewComponent<Mix>) => Props) => ({
			render: (fn: ViewRenderFn<Props>) => view(fn).component(elfn),
		}),
	})
	return view
}

