
import {Wait} from "@e280/strata"
import {Content} from "../view/types.js"

export type Spinner = <Value, E = unknown>(
	wait: Wait<Value, E>,
	ok: (value: Value) => Content,
) => Content

