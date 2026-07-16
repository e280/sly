
import {CSSResultGroup} from "lit"
import {useOnce} from "./use-once.js"
import {useShadow} from "./use-shadow.js"
import {applyStyles} from "../parts/apply-styles.js"

/** attach stylesheets to the shadow root */
export function useCss(...styles: CSSResultGroup[]) {
	const shadow = useShadow()
	useOnce(() => applyStyles(shadow, styles))
}

