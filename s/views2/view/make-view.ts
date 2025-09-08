
import {Constructor} from "@e280/stz"
import {DirectiveResult} from "lit/async-directive.js"
import {View, ViewFn} from "../types.js"
import {ViewChain} from "./parts/chain.js"
import {ViewContext} from "./parts/context.js"
import {makeComponent} from "./make-component.js"
import {makeViewDirective} from "./parts/directive.js"
import {BaseElement} from "../base/base-element.js"

export function makeView<Props extends any[]>(
		viewFn: ViewFn<Props>,
		settings: ShadowRootInit,
	): View<Props> {

	const renderDirective = makeViewDirective(viewFn, settings)

	function v(...props: Props): DirectiveResult {
		return renderDirective(new ViewContext(props))
	}

	v.props = (...props: Props) => new ViewChain(
		new ViewContext(props),
		renderDirective,
	)

	v.component = <B extends Constructor<BaseElement>>(Base: B) => ({
		props: (propFn: (component: InstanceType<B>) => Props) => (
			makeComponent<B, Props>(
				settings,
				Base,
				propFn,
				viewFn,
			)
		)
	})

	return v
}

