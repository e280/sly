
import {obMap} from "@e280/stz"
import {hashGo} from "./hash-go.js"

export function hashNav<Fns extends Record<string, () => string>>(fns: Fns) {
	return obMap(fns, fn => () => hashGo(fn()))
}

