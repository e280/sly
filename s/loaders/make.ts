
import {Loader} from "./types.js"
import {earth} from "./parts/anims.js"
import type {Content} from "../view/types.js"
import {ErrorDisplay} from "./parts/error-display.js"

export function make(
		loading: () => Content = earth,
		error: (error: any) => Content = (error: any) => ErrorDisplay(error),
	): Loader {

	return (op, ready) => op.select({loading, ready, error})
}

