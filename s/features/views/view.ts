
import {render} from "lit"
import {debounce, MapG} from "@e280/stz"
import {tracker} from "@e280/strata/tracker"
import {AsyncDirective} from "lit/async-directive.js"
import {directive, DirectiveResult} from "lit/directive.js"

import {register} from "../dom/register.js"
import {applyAttrs} from "./utils/apply-attrs.js"
import {applyStyles} from "./utils/apply-styles.js"
import {Use, _wrap, _disconnect, _reconnect} from "./use.js"
import {AttrValue, Content, ViewFn, ViewSettings, ViewWith} from "./types.js"

export const view = setupView({mode: "open"})
export class SlyView extends HTMLElement {}
register({SlyView}, {soft: true, upgrade: true})

function setupView(settings: ViewSettings) {
	function view<Props extends any[]>(fn: ViewFn<Props>) {
		class ViewDirective extends AsyncDirective {
			#element = document.createElement(settings.tag ?? "sly-view")
			#shadow = this.#element.attachShadow(settings)
			#use = new Use(this.#element, this.#shadow)
			#fn = (() => {
				const fn2 = fn(this.#use)
				this.#element.setAttribute("view", settings.name ?? "")
				if (settings.styles) applyStyles(this.#shadow, settings.styles)
				return fn2
			})()

			#tracking = new MapG<any, () => void>

			#render = debounce(0, (w: ViewWith, props: Props) => {
				if (!this.isConnected) return
				this.#use[_wrap](() => {
					// apply html attributes
					applyAttrs(this.#element, w.attrs)

					// render the template, tracking strata items
					const {result, seen} = tracker.seen(() => this.#fn(...props))

					// inject the template
					render(result, this.#shadow)

					// reacting to changes
					for (const item of seen)
						this.#tracking.guarantee(
							item,
							() => tracker.changed(item, async() => this.#render(w, props)),
						)

					// inject content into light dom
					render(w.children, this.#element)
				})
			})

			render(w: ViewWith, props: Props) {
				this.#render(w, props)
				return this.#element
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

		function setupDirective(w: ViewWith) {
			const r = directive(ViewDirective)
			const rend = (...props: Props): DirectiveResult<any> => r(w, props)
			rend.props = rend
			rend.with = (w2: Partial<ViewWith>) => setupDirective({...w, ...w2})
			rend.children = (children: Content) => setupDirective({...w, children})
			rend.attrs = (attrs: Record<string, AttrValue>) => setupDirective({...w, attrs})
			rend.attr = (name: string, value: AttrValue) => setupDirective({
				...w,
				attrs: {...w.attrs, [name]: value},
			})
			return rend
		}

		return setupDirective({
			attrs: {},
			children: null,
		})
	}

	view.view = view
	view.settings = (settings2: Partial<ViewSettings>) => setupView({...settings, ...settings2})
	return view
}

