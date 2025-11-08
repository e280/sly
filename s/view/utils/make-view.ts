
import {Constructor} from "@e280/stz"
import {DirectiveResult} from "lit/async-directive.js"

import {NakedView, View, ViewFn} from "../types.js"
import {ViewChain} from "./parts/chain.js"
import {ViewContext} from "./parts/context.js"
import {BaseElement} from "../../base/element.js"
import {makeComponent} from "./make-component.js"
import {makeViewDirective} from "./parts/directive.js"
import {NakedContext, NakedCapsule} from "./parts/naked.js"

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

	v.transmute = <PropsB extends any[]>(convert: (...propsB: PropsB) => Props) => {
		const viewFnB: ViewFn<PropsB> = use => {
			const viewFnA2 = viewFn(use)
			return (...propsB) => viewFnA2(...convert(...propsB))
		}
		return makeView<PropsB>(viewFnB, settings)
	}

	v.component = <B extends Constructor<BaseElement>>(Base: B = BaseElement as any) => ({
		props: (propFn: (component: InstanceType<B>) => Props) => (
			makeComponent<B, Props>(
				settings,
				Base,
				propFn,
				viewFn,
			)
		)
	})

	v.naked = (host: HTMLElement): NakedView<Props> => {
		const naked = new NakedCapsule(host, viewFn, settings)
		return {
			host,
			render: (...props: Props) => naked.update(new NakedContext(props)),
		}
	}

	return v
}

