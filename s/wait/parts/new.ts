
import {err, ok, Result} from "@e280/stz"
import {Wait} from "./type.js"

export const newWait = <Value, E = unknown>(): Wait<Value, E> => ({done: false})
export const newWaitDone = <Value, E = unknown>(result: Result<Value, E>) => ({done: true, ...result})
export const newWaitOk = <Value>(value: Value): Wait<Value> => ({done: true, ...ok(value)})
export const newWaitErr = <E>(error: E): Wait<unknown, E> => ({done: true, ...err(error)})

