
import type {Op} from "../op/op.js"
import type {Content} from "../view/types.js"

export type Loader = <V>(op: Op<V>, ready: (value: V) => Content) => Content

