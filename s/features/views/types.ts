
import {Constructor} from "@e280/stz"
import {DirectiveResult} from "lit/directive.js"
import {CSSResultGroup, TemplateResult} from "lit"

import {Use} from "./use.js"

export type Content = TemplateResult | DirectiveResult | HTMLElement | string | null | undefined | void | Content[]
export type AttrValue = string | boolean | number | undefined | null | void

export type Component<Props extends any[] = []> = {
	render(...props: Props): void
} & HTMLElement

export type ComponentFn = (use: Use) => Content
export type ViewFn<Props extends any[]> = (use: Use) => (...props: Props) => Content
export type BasicView<Props extends any[]> = (...props: Props) => DirectiveResult<any>
export type View<Props extends any[]> = BasicView<Props> & {
	props: View<Props>
	with: (w: Partial<ViewWith>) => View<Props>
	children: (...children: Content[]) => View<Props>
	attrs: (attrs: Record<string, AttrValue>) => View<Props>
	attr: (name: string, value: AttrValue) => View<Props>
	component: (...props: Props) => Constructor<Component>
}

export type ViewSettings = ShadowRootInit & {
	tag?: string
	name?: string
	styles?: CSSResultGroup
}

export type ViewWith = {
	children: Content
	attrs: Record<string, AttrValue>
}

