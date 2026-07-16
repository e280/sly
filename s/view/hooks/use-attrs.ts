
import {useRef} from "./use-ref.js"
import {dom} from "../../dom/dom.js"
import {useOnce} from "./use-once.js"
import {useHost} from "./use-host.js"
import {useMount} from "./use-mount.js"
import {useRender} from "./use-render.js"
import {AttrSpec} from "../../dom/types.js"
import {useRendered} from "./use-rendered.js"

export function useAttrs<A extends AttrSpec>(spec: A) {
	const host = useHost()
	const rerender = useRender()
	const ourChanges = useRef(new Set<string>())

	useMount(() => dom.attrs(host).on(records => {
		for (const record of records) {
			if (ourChanges.current.has(record.attributeName!)) continue
			rerender()
			break
		}
	}))

	useRendered().then(() => ourChanges.current.clear())

	return useOnce(() => dom.attrs(host).spec(spec, {
		beforeSet: key => ourChanges.current.add(key),
	}))
}

