
import {signal} from "@e280/strata"
import {norm} from "./norm.js"
import {cleanHash} from "./clean-hash.js"

export function hashRouteSignal<R>(route: (path: string) => R) {
	const $content = signal<R>(undefined!)

	function update() {
		cleanHash()
		return $content(route(norm(location.hash)))
	}

	addEventListener("hashchange", update)
	update()

	return $content
}

