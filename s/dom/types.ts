
export type Renderable = HTMLElement | ShadowRoot | DocumentFragment
export type Queryable = HTMLElement | ShadowRoot | Element | Document | DocumentFragment

export type HTMLElementClasses = {
	[key: string]: {new(...args: any[]): HTMLElement}
}

