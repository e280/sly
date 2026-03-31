
import {obMap} from "@e280/stz"
import {hashGo} from "./hash-go.js"

export function hashNav<Fns extends Record<string, (...params: any[]) => string>>(fns: Fns) {
	return obMap(fns, fn => (...params: any[]) => hashGo(fn(...params))) as {
		[K in keyof Fns]: (...params: Parameters<Fns[K]>) => void
	}
}

