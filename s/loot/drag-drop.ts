
import {signal} from "@e280/strata"
import {dragIsOutsideCurrentTarget} from "./helpers.js"

/** system for dragging-and-dropping things around on a webpage */
export class DragDrop<Grabbed, Hovering> {
	#$grabbed = signal<Grabbed | undefined>(undefined)
	#$hovering = signal<Hovering | undefined>(undefined)

	constructor(private params: {

		/** accept a dropped item that was declared within this system */
		acceptDrop: (event: DragEvent, grabbed: Grabbed, hovering: Hovering) => void

		/** accept undeclared drops from outside this system */
		fromOutside?: {
			predicate: (event: DragEvent, hovering: Hovering) => boolean
			acceptDrop: (event: DragEvent, hovering: Hovering) => void
		}
	}) {}

	/** make event listeners to attach to your dragzone(s) */
	readonly dragzone = {
		draggable: () => "true",

		dragstart: (grabbed: Grabbed) => (_: DragEvent) => {
			this.#$grabbed.value = grabbed
		},

		dragend: () => (_: DragEvent) => {
			this.#$grabbed.value = undefined
			this.#$hovering.value = undefined
		},
	}

	/** make event listeners to attach to your dropzones(s) */
	readonly dropzone = {
		dragenter: () => (_: DragEvent) => {},

		dragleave: () => (event: DragEvent) => {
			if (dragIsOutsideCurrentTarget(event))
				this.#$hovering.value = undefined
		},

		dragover: (hovering: Hovering) => (event: DragEvent) => {
			event.preventDefault()
			const {fromOutside} = this.params

			if (this.#$grabbed() || (fromOutside && fromOutside.predicate(event, hovering)))
				this.#$hovering.value = hovering
		},

		drop: (hovering: Hovering) => (event: DragEvent) => {
			event.preventDefault()
			const {acceptDrop, fromOutside} = this.params

			const grabbed = this.#$grabbed()
			this.#$grabbed.value = undefined
			this.#$hovering.value = undefined

			if (grabbed)
				acceptDrop(event, grabbed, hovering)
			else if (fromOutside && fromOutside.predicate(event, hovering))
				fromOutside.acceptDrop(event, hovering)
		},
	}

	get grabbed() {
		return this.#$grabbed()
	}

	get hovering() {
		return this.#$hovering()
	}
}

