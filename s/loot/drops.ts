
import {signal} from "@e280/strata"
import {outsideCurrentTarget} from "./helpers.js"

/** dropzone that accepts user-dropped stuff like files */
export class Drops {
	$indicator = signal(false)

	constructor(private params: {

		/** whether or not the dragged item is acceptable for a drop */
		predicate: (event: DragEvent) => boolean

		/** fn to handle the drop of an acceptable item */
		acceptDrop: (event: DragEvent) => void
	}) {}

	dragover = (event: DragEvent) => {
		event.preventDefault()
		this.$indicator(this.params.predicate(event))
	}

	dragleave = (event: DragEvent) => {
		if (outsideCurrentTarget(event))
			this.$indicator(false)
	}

	drop = (event: DragEvent) => {
		event.preventDefault()
		this.$indicator(false)
		if (this.params.predicate(event))
			this.params.acceptDrop(event)
	}
}

