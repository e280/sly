
/** respond when any attribute changes on the html element */
export function onAttrs(element: HTMLElement, fn: MutationCallback) {
	const observer = new MutationObserver(fn)
	observer.observe(element, {attributes: true})
	return () => observer.disconnect()
}

