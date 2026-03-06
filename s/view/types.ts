
import {TemplateResult} from "lit"
import {DirectiveResult} from "lit/async-directive.js"

export type Content = TemplateResult | DirectiveResult | HTMLElement | string | null | undefined | void | Content[]

export type View<Props extends any[]> = (...props: Props) => Content

export type ViewAttr = string | number | boolean
export type ViewAttrs = Record<string, ViewAttr>

export type Placement<Props extends any[]> = {
	props: Props
	children?: Content
	attrs?: ViewAttrs
}

export type ShadowView<Props extends any[]> = View<Props> & {
	with: (placement: Placement<Props>) => Content
}

export type ShadowSetup = {
	host: HTMLElement
	shadow: ShadowRoot
}

