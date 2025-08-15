
import {render} from "lit"
import {Directive, directive, DirectiveResult} from "lit/directive.js"

import {Use} from "./use.js"
import {register} from "../dom/register.js"
import {applyAttrs} from "./utils/apply-attrs.js"
import {applyStyles} from "./utils/apply-styles.js"
import {Content, ViewFn, ViewSettings, ViewWith} from "./types.js"

export const shadowView = setupShadowView({
	mode: "open",
})

export class SlyView extends HTMLElement {}

register({SlyView}, {soft: true, upgrade: true})

function setupShadowView(settings: ViewSettings) {
	function shadowView<Props extends any[]>(fn: ViewFn<Props>) {
		class ViewDirective extends Directive {
			#element = document.createElement(settings.tag ?? "sly-view")
			#shadow = this.#element.attachShadow(settings)
			#use = new Use(this.#element, this.#shadow)
			#fn = (() => {
				const fn2 = fn(this.#use)
				this.#element.setAttribute("view", settings.name ?? "")
				if (settings.styles) applyStyles(this.#shadow, settings.styles)
				return fn2
			})()

			render(w: ViewWith, props: Props) {
				// apply html attributes
				applyAttrs(this.#element, w.attrs)

				// render template into shadow dom
				render(this.#fn(...props), this.#shadow)

				// render content into light dom
				render(w.content, this.#element)

				// increment use run
				Use.run(this.#use)

				// return the sly-view element
				return this.#element
			}
		}

		function setupDirective(w: ViewWith) {
			const r = directive(ViewDirective)
			const rend = (...props: Props): DirectiveResult<any> => r(w, props)
			rend.render = rend
			rend.with = (w2: Partial<ViewWith>) => setupDirective({...w, ...w2})
			rend.content = (content: Content) => setupDirective({...w, content})
			rend.attrs = (attrs: Record<string, string>) => setupDirective({...w, attrs})
			return rend
		}

		return setupDirective({
			attrs: {},
			content: null,
		})
	}

	shadowView.view = shadowView
	shadowView.settings = (settings2: Partial<ViewSettings>) => setupShadowView({...settings, ...settings2})
	return shadowView
}

