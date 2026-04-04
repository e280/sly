
import {signal} from "@e280/strata"
import {norm} from "./norm.js"
import {cleanHash} from "./clean-hash.js"

export function hashSignal() {
	function get() {
		cleanHash()
		return norm(location.hash)
	}
	const $hash = signal<string>(get())
	addEventListener("hashchange", () => $hash(get()))
	return $hash
}

