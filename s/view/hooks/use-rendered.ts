
import {useCx} from "./plumbing/use-cx.js"

/** return a promise that resolves after the next render is complete */
export function useRendered() {
	return useCx().rendered.promise
}

