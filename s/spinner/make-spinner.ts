
import {Spinner} from "./types.js"
import {Content} from "../view/types.js"
import {waitSelect} from "../wait/parts/select.js"

export function makeSpinner(
		pending: () => Content,
		err: (error: unknown) => Content,
	): Spinner {
	
	return (wait, ok) => waitSelect(wait, {pending, err, ok})
}

