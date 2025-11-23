
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
	const currentTarget = event.currentTarget as HTMLElement
	const relatedTarget = event.relatedTarget as HTMLElement
	const nulled = !currentTarget || !relatedTarget
	return nulled || !currentTarget.contains(relatedTarget)
}

