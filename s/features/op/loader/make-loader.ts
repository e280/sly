
import {Op} from "../op.js"
import {braille} from "./parts/anims.js"
import {Content} from "../../views/types.js"
import {ErrorDisplay} from "./parts/error-display.js"

export * as anims from "./parts/anims.js"

export type Loader = <V>(op: Op<V>, ready: (value: V) => Content) => Content

export const errorDisplay = (error: any) => ErrorDisplay(error)

export function makeLoader(
		loading: () => Content = braille,
		error: (error: any) => Content = errorDisplay,
	): Loader {

	return (op, ready) => op.select({loading, ready, error})
}

