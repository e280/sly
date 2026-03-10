
import {Loader} from "./types.js"

export function mock(): Loader {
	return (op, ready) => op.select({
		ready,
		loading: () => `[loading]`,
		error: () => `[error]`,
	})
}

