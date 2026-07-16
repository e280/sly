
import {hooks} from "./hooks.js"

export function useCx() {
	return hooks.increment().scope.cx
}

