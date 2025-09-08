
import {DirectiveResult} from "lit/async-directive.js"
import {ViewContext} from "./context.js"
import {AttrValue, Content} from "../../types.js"

/** provides fluent chaining interface for adding context to rendering a view, think view.props().attr().children().render() */
export class ViewChain<Props extends any[]> {
	#render: (context: ViewContext<Props>) => DirectiveResult
	#context: ViewContext<Props>

	constructor(
			context: ViewContext<Props>,
			renderDirective: (context: ViewContext<Props>) => DirectiveResult,
		) {
		this.#context = context
		this.#render = renderDirective
	}

	attr(key: string, value: AttrValue) {
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

