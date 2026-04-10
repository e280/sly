
import {Result} from "@e280/stz"

export type Wait<Value, E = unknown> =
	| {done: false}
	| {done: true} & Result<Value, E>

