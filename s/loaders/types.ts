
import type {Op} from "../ops/op.js"
import type {Content} from "../ui/types.js"

export type Loader = <V>(op: Op<V>, ready: (value: V) => Content) => Content

