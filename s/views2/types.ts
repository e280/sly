
import {TemplateResult} from "lit"
import {DirectiveResult} from "lit/directive.js"
import {Use} from "./units/use.js"
import {BaseElement} from "./units/base-element.js"

export type Content = TemplateResult | DirectiveResult | HTMLElement | string | null | undefined | void | Content[]
export type AttrValue = string | boolean | number | undefined | null | void

export type ViewFn<Props extends any[]> = (
	(use: Use) =>
	(...props: Props) =>
	Content
)

export type ComponentClass<Props extends any[]> = {
	view: (...props: Props) => DirectiveResult
	new(): BaseElement
} & typeof BaseElement

