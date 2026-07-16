
import {useCx} from "./use-cx.js"
import {ShadowCx} from "../../parts/cx.js"

export function useShadowCx() {
	const cx = useCx()

	if (!(cx instanceof ShadowCx))
		throw new Error("this hook only works on shadow views (but was called in a light view)")

	return cx
}

