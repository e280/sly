
import {TemplateResult} from "lit"
import {Constructor} from "@e280/stz"
import {DirectiveResult} from "lit/directive.js"

import {Use} from "../base/use.js"
import {BaseElement} from "../base/element.js"
import {ViewChain} from "./utils/parts/chain.js"

export type Content = TemplateResult | DirectiveResult | HTMLElement | string | null | undefined | void | Content[]
export type AttrValue = string | boolean | number | undefined | null | void

export type ViewFn<Props extends any[]> = (
	(use: Use) =>
	(...props: Props) =>
	Content
)

export type View<Props extends any[]> = {
	(...props: Props): DirectiveResult
	props: (...props: Props) => ViewChain<Props>
	transmute: <PropsB extends any[]>(convert: (...propsB: PropsB) => Props) => View<PropsB>
	component: <B extends Constructor<BaseElement>>(Base?: B) => {
		props: (propFn: (component: InstanceType<B>) => Props) => (
			ComponentClass<B, Props>
		)
	}
}

export type ViewProps<V extends View<any>> = (
	V extends View<infer Props>
		? Props
		: never
)

export type ComponentClass<B extends Constructor<BaseElement>, Props extends any[]> = {
	view: View<Props>
	new(): InstanceType<B>
} & B

