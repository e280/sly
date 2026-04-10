
import {getErr, getOk, needErr, needOk} from "@e280/stz"
import {Wait} from "./type.js"

export function waitGetOk<Value>(wait: Wait<Value>) {
	return wait.done
		? getOk(wait)
		: undefined
}

export function waitNeedOk<Value>(wait: Wait<Value>) {
	if (!wait.done) throw new Error("wait not done")
	return needOk(wait)
}

export function waitGetErr<E = unknown>(wait: Wait<unknown, E>) {
	return wait.done
		? getErr(wait)
		: undefined
}

export function waitNeedErr<E = unknown>(wait: Wait<unknown, E>) {
	if (!wait.done) throw new Error("wait not done")
	return needErr(wait)
}

