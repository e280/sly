
export type EveFn = (event: any) => void
export type EveConfig = [options: AddEventListenerOptions, fn: EveFn]
export type EveHandler = EveFn | EveConfig
export type EveSpec = {[eventName: string]: EveHandler}

export function eve(target: EventTarget, events: EveSpec) {
	let detachers: (() => void)[] = []

	for (const [eventName, handler] of Object.entries(events)) {
		if (typeof handler === "function") {
			target.addEventListener(eventName, handler)
			detachers.push(() => target.removeEventListener(eventName, handler))
		}
		else {
			const [options, fn] = handler
			target.addEventListener(eventName, fn, options)
			detachers.push(() => target.removeEventListener(eventName, fn))
		}
	}

	return () => detachers.forEach(d => d())
}

