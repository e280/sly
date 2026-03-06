
export class Mounts {
	#mounters: (() => () => void)[] = []
	#unmounters: (() => void)[] = []

	mount(mount: () => () => void) {
		this.#mounters.push(mount)
		this.#unmounters.push(mount())
	}

	unmountAll() {
		for (const unmount of this.#unmounters)
			unmount()
		this.#unmounters = []
	}

	remountAll() {
		for (const mount of this.#mounters)
			this.#unmounters.push(mount())
	}
}

