
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

