
import {CSSResultGroup, TemplateResult} from "lit"
import {DirectiveResult} from "lit/directive"

import {Use} from "./use.js"

export type Content = TemplateResult | DirectiveResult | HTMLElement | string | null | undefined | void
export type AttrValue = string | boolean | number | undefined | null | void

export type ViewFn<Props extends any[]> = (use: Use) => (...props: Props) => Content
export type View<Props extends any[]> = (...props: Props) => DirectiveResult<any>

export type ViewSettings = ShadowRootInit & {
	tag?: string
	name?: string
	styles?: CSSResultGroup
}

export type ViewWith = {
	content: Content
	attrs: Record<string, string>
}

