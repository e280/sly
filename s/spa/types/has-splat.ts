
export type HasSplat<Path extends string> =
	Path extends `{*}`
		? true
		: Path extends `${string}/{*}`
			? true
			: false

