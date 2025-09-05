
import {signal} from "@e280/strata"
import {outsideCurrentTarget} from "./helpers.js"

/** dropzone that accepts dropped stuff like files */
export class Drop {
	$indicator = signal(false)

	constructor(private params: {

		/** whether or not the dragged item is acceptable for a drop */
		predicate: (event: DragEvent) => boolean

		/** fn to handle the drop of an acceptable item */
		acceptDrop: (event: DragEvent) => void
	}) {}

	dragover = (event: DragEvent) => {
		event.preventDefault()
		if (this.params.predicate(event))
			this.$indicator.value = true
	}

	dragleave = (event: DragEvent) => {
		if (outsideCurrentTarget(event))
			this.$indicator.value = false
	}

	drop = (event: DragEvent) => {
		event.preventDefault()
		this.$indicator.value = false
		if (this.params.predicate(event))
			this.params.acceptDrop(event)
	}
}

