
import {useOnce} from "./use-once.js"
import {ShadowCx} from "../parts/cx.js"
import {useCx} from "./plumbing/use-cx.js"

/** set host element's "view" attribute (or, if we're a light view, do nothing). */
export function useName(name = "") {
	const cx = useCx()

	useOnce(() => {
		if (cx instanceof ShadowCx)
			cx.host.setAttribute("view", name)
	})
}

