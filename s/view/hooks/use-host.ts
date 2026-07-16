
import {useShadowCx} from "./plumbing/use-shadow-cx.js"

/** return the shadow view's host element */
export function useHost() {
	return useShadowCx().host
}

