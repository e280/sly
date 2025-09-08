
import {Content} from "../../types.js"
import {ViewContext} from "./context.js"
import {DirectiveResult} from "lit/async-directive.js"

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

