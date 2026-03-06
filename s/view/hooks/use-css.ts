
import {CSSResultGroup} from "lit"
import {useShadow} from "./use-cx.js"
import {useOnce} from "./use-once.js"
import {applyStyles} from "../parts/apply-styles.js"

/** attach stylesheets to the shadow root */
export function useCss(...styles: CSSResultGroup[]) {
	const shadow = useShadow()
	useOnce(() => applyStyles(shadow, styles))
}

export const useStyles = useCss

