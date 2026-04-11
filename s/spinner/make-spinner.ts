
import {waitSelect} from "@e280/strata"

import {Spinner} from "./types.js"
import {Content} from "../view/types.js"

export function makeSpinner(
		pending: () => Content,
		err: (error: unknown) => Content,
	): Spinner {
	
	return (wait, ok) => waitSelect(wait, {pending, err, ok})
}

