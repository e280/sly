
import {Content} from "../view/types.js"

export {Content}

export type ContentFn<Props extends any[]> = (...props: Props) => Content

export class LightCx {
	constructor(public render: () => Promise<void>) {}
}

export class ShadowCx extends LightCx {
	constructor(
			render: () => Promise<void>,
			public host: HTMLElement,
			public shadow: ShadowRoot,
		) {
		super(render)
	}
}

export type ShadowSetup = {
	host: HTMLElement
	shadow: ShadowRoot
}

