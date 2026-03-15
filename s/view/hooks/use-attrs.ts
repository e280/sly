
import {dom} from "../../dom/dom.js"
import {useOnce} from "./use-once.js"
import {useMount} from "./use-mount.js"
import {AttrSpec} from "../../dom/types.js"
import {useHost, useRender} from "./use-cx.js"

export function useAttrs<A extends AttrSpec>(spec: A) {
	const host = useHost()
	const rerender = useRender()
	useMount(() => dom.attrs(host).on(rerender))
	return useOnce(() => dom.attrs(host).spec(spec))
}

