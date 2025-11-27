
import {render} from "lit"
import {eve, EveSpec} from "./eve.js"
import {attrs} from "../attrs/attrs.js"
import {Content} from "../../view/types.js"
import {Attrs, Queryable, Renderable} from "../types.js"
import {queryAll, queryMaybe, queryRequire} from "./queries.js"

export class Dom<C extends Queryable> {
	#attrs?: Attrs

	constructor(public element: C) {}

	in<E extends Queryable>(selectorOrElement: string | E) {
		return new Dom<E>(
			(typeof selectorOrElement === "string")
				? queryRequire(selectorOrElement, this.element) as E
				: selectorOrElement
		)
	}

	require<E extends Element = HTMLElement>(selector: string) {
		return queryRequire<E>(selector, this.element)
	}

	maybe<E extends Element = HTMLElement>(selector: string) {
		return queryMaybe<E>(selector, this.element)
	}

	all<E extends Element = HTMLElement>(selector: string) {
		return queryAll<E>(selector, this.element)
	}

	render(...content: Content[]) {
		return render(content, this.element as Renderable)
	}

	get attrs(): Attrs {
		return this.#attrs ??= attrs(this.element as HTMLElement)
	}

	events(spec: EveSpec) {
		return eve(this.element, spec)
	}
}

