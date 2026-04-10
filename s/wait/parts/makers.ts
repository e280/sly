
import {Wait} from "./type.js"

export const waitPending = (): Wait<unknown> => ["pending"]
export const waitDone = <Value>(value: Value): Wait<Value> => ["done", value]
export const waitFailed = <Fail extends string = string>(fail: Fail): Wait<unknown, Fail> => ["failed", fail]

