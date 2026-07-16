
import {useHost} from "./use-host.js"
import {useOnce} from "./use-once.js"

/** sets the host element's "data-view" attribute */
export function useName(name = "") {
	const host = useHost()
	useOnce(() => host.setAttribute("view", name))
}

