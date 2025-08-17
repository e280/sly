
import {Op} from "../op.js"
import {braille} from "./parts/anims.js"
import {Content} from "../../views/types.js"
import {ErrorDisplay} from "./parts/error-display.js"

export * as anims from "./parts/anims.js"

export type Loader = <V>(op: Op<V>, ready: (value: V) => Content) => Content

export function makeLoader(
		loading: () => Content = braille,
		error: (error: any) => Content = (error: any) => ErrorDisplay(error),
	): Loader {

	return (op, ready) => op.select({loading, ready, error})
}

