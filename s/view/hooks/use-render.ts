
import {useCx} from "./plumbing/use-cx.js"

/** return a function that triggers the view to rerender */
export function useRender() {
	return useCx().render
}

