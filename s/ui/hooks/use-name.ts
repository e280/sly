
import {useHost} from "./use-cx.js"
import {useOnce} from "./use-once.js"

export function useName(name: string) {
	const host = useHost()
	useOnce(() => host.setAttribute("data-view", name))
}

