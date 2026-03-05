
import {Content} from "../view/types.js"

export {Content}

export type ContentFn<Props extends any[]> = (...props: Props) => Content

export type ShadowSetup = {
	host: HTMLElement
	shadow: ShadowRoot
}

