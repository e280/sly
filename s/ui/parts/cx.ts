
import {defer} from "@e280/stz"

export class LightCx {
	count = 0
	rendered = defer<void>()

	constructor(public render: () => Promise<void>) {}

	doneRender() {
		this.count++
		this.rendered.resolve()
		this.rendered = defer()
	}
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

