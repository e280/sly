
import {station} from "./plumbing/station.js"

export function useView() {
	const {scope} = station.increment()
	return scope.view
}

