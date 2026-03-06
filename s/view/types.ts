
import {TemplateResult} from "lit"
import {DirectiveResult} from "lit/async-directive.js"

export type Content = TemplateResult | DirectiveResult | HTMLElement | string | null | undefined | void | Content[]

export type ContentFn<Props extends any[]> = (...props: Props) => Content

export type PrimitiveAttr = string | number | boolean
export type PrimitiveAttrs = Record<string, PrimitiveAttr>

export type Placement<Props extends any[]> = {
	props: Props
	children?: Content
	attrs?: PrimitiveAttrs
}

export type ShadowView<Props extends any[]> = ContentFn<Props> & {
	with: (placement: Placement<Props>) => Content
}

export type ShadowSetup = {
	host: HTMLElement
	shadow: ShadowRoot
}

