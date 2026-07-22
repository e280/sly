
import {derived, signal} from "@e280/strata"
import {norm} from "./norm.js"
import {cleanHash} from "./clean-hash.js"

/** @deprecated replaced by `watchHash`. */
export function hashSignal() {
	function get() {
		cleanHash()
		return norm(location.hash)
	}
	const $hash = signal<string>(get())
	addEventListener("hashchange", () => $hash(get()))
	return $hash
}

/** return a strata derived signal that updates whenever the url changes. */
export function watchHash() {
	function get() {
		cleanHash()
		return norm(location.hash)
	}
	const $hash = signal<string>(get())
	addEventListener("hashchange", () => $hash(get()))
	return derived(() => $hash())
}

