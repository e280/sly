
import {signal, Signal} from "@e280/strata"

export type Task<Value, Fail extends string = string>
	= ["pending"]
	| ["ready", Value]
	| ["failed", Fail]

export const isTaskPending = ([s]: Task<unknown>) => s === "pending"
export const isTaskReady = ([s]: Task<unknown>) => s === "ready"
export const isTaskFailed = ([s]: Task<unknown>) => s === "failed"

export const taskPending = (): Task<unknown> => ["pending"]
export const taskReady = <Value>(value: Value): Task<Value> => ["ready", value]
export const taskFailed = <Fail extends string = string>(fail: Fail): Task<unknown, Fail> => ["failed", fail]

export function getTaskValue<Value>(task: Task<Value>) {
	return task[0] === "ready"
		? task[1]
		: undefined
}

export function needTaskValue<Value>(task: Task<Value>) {
	if (task[0] !== "ready") throw new Error("task not ready")
	return task[1]
}

export type Wait<Value, Fail extends string = string> = Signal<Task<Value, Fail>>

export function wait<Value, Fail extends string = string>(fn: () => Promise<Value>) {
	return waitPromise<Value, Fail>(fn())
}

export function waitPromise<Value, Fail extends string = string>(promise: Promise<Value>) {
	const $wait: Wait<Value, Fail> = signal<Task<Value, Fail>>(["pending"])

	const done = promise
		.then(value => $wait(["ready", value]))
		.then(task => task[1] as Value)
		.catch(error => {
			$wait(["failed", failstring(error) as Fail])
			return undefined
		})

	return [$wait, done] as [$wait: Wait<Value, Fail>, done: Promise<Value | undefined>]
}

function failstring(error: unknown) {
	if (typeof error === "string") return error
	else if (error instanceof Error) return error.message
	else return "error"
}

