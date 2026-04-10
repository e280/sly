
import {Wait} from "./type.js"
import {isWaitOk, isWaitPending} from "./is.js"
import {waitNeedErr, waitNeedOk} from "./get.js"

export function waitSelect<Ret, Value, E = unknown>(wait: Wait<Value, E>, select: {
		pending: () => Ret,
		ok: (value: Value) => Ret
		err: (error: E) => Ret
	}) {

	if (isWaitPending(wait))
		return select.pending()

	else if (isWaitOk(wait))
		return select.ok(waitNeedOk(wait))

	else
		return select.err(waitNeedErr(wait))
}

