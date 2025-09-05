
export function hasFiles(event: DragEvent) {
	return !!(
		event.dataTransfer &&
		event.dataTransfer.types.includes("Files")
	)
}

export function files(event: DragEvent) {
	return event.dataTransfer
		? Array.from(event.dataTransfer.files)
		: []
}

export function outsideCurrentTarget(event: DragEvent) {
	const isCursorOutsideViewport = !event.relatedTarget || (
		event.clientX === 0 &&
		event.clientY === 0
	)

	if (isCursorOutsideViewport)
		return true

	const rect = (event.currentTarget as any).getBoundingClientRect()
	const withinX = event.clientX >= rect.left && event.clientX <= rect.right
	const withinY = event.clientY >= rect.top && event.clientY <= rect.bottom
	const cursorOutsideCurrentTarget = !(withinX && withinY)

	return cursorOutsideCurrentTarget
}

