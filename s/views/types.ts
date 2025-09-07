
import {DirectiveResult} from "lit/directive.js"
import {CSSResultGroup, TemplateResult} from "lit"

import {Use} from "./use.js"

export type Content = TemplateResult | DirectiveResult | HTMLElement | string | null | undefined | void | Content[]
export type AttrValue = string | boolean | number | undefined | null | void

export type ViewComponent<Mix extends {} = {}> = Mix & {
	renderNow(): void
	render: () => void
} & HTMLElement

export type ViewComponentClass<Mix extends {}, Props extends any[]> = {
	view: View<Props>
	new(): ViewComponent<Mix>
}

export type ViewRenderFn<Props extends any[]> = (use: Use) => (...props: Props) => Content
export type BasicView<Props extends any[]> = (...props: Props) => DirectiveResult<any>

export type View<Props extends any[]> = BasicView<Props> & {
	props: (...props: Props) => ViewChain
	component: <Mix extends {}>(fn: (el: ViewComponent<Mix>) => Props) => (
		ViewComponentClass<Mix, Props>
	)
}

export type ViewSettings = ShadowRootInit & {
	tag?: string
	name?: string
	styles?: CSSResultGroup
}

export type ViewChain = {
	children(...c: Content[]): ViewChain
	attrs(a: Record<string, AttrValue>): ViewChain
	attr(n: string, v: AttrValue): ViewChain
	render(): DirectiveResult<any>
}

export type ViewContext = {
	children: Content[]
	attrs: Record<string, AttrValue>
}

