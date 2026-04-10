
import {Derived, derived, signal} from "@e280/strata"
import {Wait} from "./type.js"
import {failstring} from "./utils/failstring.js"

export function wait<Value, Fail extends string = string>(fn: () => Promise<Value>) {
	return waitPromise<Value, Fail>(fn())
}

export function waitPromise<Value, Fail extends string = string>(promise: Promise<Value>) {
	const $wait = signal<Wait<Value, Fail>>(["pending"])

	const done = promise
		.then(value => $wait(["done", value]))
		.then(task => task[1] as Value)
		.catch(error => {
			$wait(["failed", failstring(error) as Fail])
			return undefined
		})

	const $derived = derived(() => $wait())
	return [$derived, done] as [$wait: Derived<Wait<Value, Fail>>, done: Promise<Value | undefined>]
}

