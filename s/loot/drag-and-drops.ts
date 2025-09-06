
import {signal} from "@e280/strata"
import {Drops} from "./drops.js"
import {outsideCurrentTarget} from "./helpers.js"

/** respond to user dragging-and-dropping things around on a webpage */
export class DragAndDrops<Draggy, Droppy> {

	/** what is currently being dragged */
	$draggy = signal<Draggy | undefined>(undefined)

	/** what dropzone are we curently hovering over */
	$droppy = signal<Droppy | undefined>(undefined)

	constructor(private params: {

		/** accept a dropped item that was declared within this system */
		acceptDrop: (event: DragEvent, draggy: Draggy, droppy: Droppy) => void

		/** also accept drops on the side */
		backchannelDrops?: Drops
	}) {}

	get dragging() {
		return this.$draggy()
	}

	get hovering() {
		return this.$droppy()
	}

	/** make event listeners to attach to your dragzone(s) */
	dragzone = (getDraggy: () => Draggy) => ({
		draggable: "true",

		dragstart: (_: DragEvent) => {
			this.$draggy.value = getDraggy()
		},

		dragend: (_: DragEvent) => {
			this.$draggy.value = undefined
			this.$droppy.value = undefined
		},
	})

	/** make event listeners to attach to your dropzones(s) */
	dropzone = (getDroppy: () => Droppy) => ({
		dragenter: (_: DragEvent) => {},

		dragover: (event: DragEvent) => {
			event.preventDefault()
			if (this.$draggy())
				this.$droppy.value = getDroppy()
			else
				this.params.backchannelDrops?.dragover(event)
		},

		dragleave: (event: DragEvent) => {
			if (outsideCurrentTarget(event))
				this.$droppy.value = undefined
			this.params.backchannelDrops?.dragleave(event)
		},

		drop: (event: DragEvent) => {
			event.preventDefault()
			const {acceptDrop} = this.params
			const draggy = this.$draggy()
			const droppy = this.$droppy()
			try {
				if (draggy && droppy)
					acceptDrop(event, draggy, droppy)
				else
					this.params.backchannelDrops?.drop(event)
			}
			finally {
				this.$draggy.value = undefined
				this.$droppy.value = undefined
			}
		},
	})
}

