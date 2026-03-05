
import {station} from "./plumbing/station.js"

export function useHeart() {
	const {scope} = station.increment()
	return scope.heart
}

