
import {useShadowCx} from "./plumbing/use-shadow-cx.js"

/** return the shadow root */
export function useShadow() {
	return useShadowCx().shadow
}

