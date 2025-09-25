
import {Loader} from "./types.js"

export function mockLoader(): Loader {
	return (op, ready) => op.select({
		ready,
		loading: () => `[loading]`,
		error: () => `[error]`,
	})
}

