
import {ShadowCx} from "../types.js"
import {station} from "./plumbing/station.js"

function useCx() {
	const {scope} = station.increment()
	return scope.cx
}

function useShadowCx() {
	const cx = useCx()
	if (!(cx instanceof ShadowCx))
		throw new Error("this hook only works on shadow views (but was called in a light view)")
	return cx
}

export function useRender() {
	return useCx().render
}

export function useHost() {
	return useShadowCx().host
}

export function useShadow() {
	return useShadowCx().shadow
}

