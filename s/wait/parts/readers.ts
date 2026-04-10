
import {Wait} from "./type.js"

export const isWaitPending = ([s]: Wait<unknown>) => s === "pending"
export const isWaitDone = ([s]: Wait<unknown>) => s === "done"
export const isWaitFailed = ([s]: Wait<unknown>) => s === "failed"

export function getWaitValue<Value>(task: Wait<Value>) {
	return task[0] === "done"
		? task[1]
		: undefined
}

export function needWaitValue<Value>(task: Wait<Value>) {
	if (task[0] !== "done") throw new Error("wait not done")
	return task[1]
}

export function getWaitFail<Fail extends string = string>(task: Wait<unknown, Fail>) {
	return task[0] === "failed"
		? task[1]
		: undefined
}

export function needWaitFail<Fail extends string = string>(task: Wait<unknown, Fail>) {
	if (task[0] !== "failed") throw new Error("wait not failed")
	return task[1]
}

