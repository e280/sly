
import {Wait} from "../wait/index.js"
import {Content} from "../view/types.js"

export type Spinner = <Value, E = unknown>(
	wait: Wait<Value, E>,
	ok: (value: Value) => Content,
) => Content

