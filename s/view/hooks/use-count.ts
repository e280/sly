
import {useCx} from "./plumbing/use-cx.js"

/** return the current count of how many times this view has been rendered (starts at 0) */
export function useCount() {
	return useCx().count
}

