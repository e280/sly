
import {ShadowCx} from "../parts/cx.js"
import {hooks} from "./plumbing/hooks.js"

function useCx() {
	const {scope} = hooks.increment()
	return scope.cx
}

function useShadowCx() {
	const cx = useCx()
	if (!(cx instanceof ShadowCx))
		throw new Error("this hook only works on shadow views (but was called in a light view)")
	return cx
}

/** return the current count of how many times this view has been rendered (starts at 0) */
export function useCount() {
	return useCx().count
}

/** return a function that triggers the view to rerender */
export function useRender() {
	return useCx().render
}

/** return a promise that resolves after the next render is complete */
export function useRendered() {
	return useCx().rendered.promise
}

/** return the shadow view's host element */
export function useHost() {
	return useShadowCx().host
}

/** return the shadow root */
export function useShadow() {
	return useShadowCx().shadow
}

