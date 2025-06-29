
import {sub, tracker} from "@e280/stz"

export function signal<V>(value: V) {
	return new Signal<V>(value)
}

export class Signal<V> {
	on = sub<[V]>()
	published: Promise<V>

	constructor(public sneak: V) {
		this.published = Promise.resolve(sneak)
	}

	get value() {
		tracker.see(this)
		return this.sneak
	}

	set value(v: V) {
		if (v !== this.sneak)
			this.publish(v)
	}

	publish(v = this.value) {
		this.sneak = v
		tracker.change(this)
		this.published = this.on.pub(v).then(() => v)
	}

	dispose() {
		this.on.clear()
	}
}

