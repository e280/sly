
import {ok} from "@e280/stz"
import {derived, signal} from "@e280/strata"
import {Wait} from "./type.js"
import {newWait, newWaitErr} from "./new.js"

export function wait<Value, E = unknown>(
		input: Promise<Value> | (() => Promise<Value>),
	) {

	let promise: Promise<Value>

	try {
		promise = (typeof input === "function")
			? input()
			: input
	}
	catch (error) {
		promise = Promise.reject(error)
	}

	return waitPromise<Value, E>(promise)
}

export function waitPromise<Value, E = unknown>(promise: Promise<Value>) {
	const $wait = signal<Wait<Value, E>>(newWait<Value, E>())
	const $derived = derived(() => $wait())

	const done = promise
		.then(value => {
			$wait({done: true, ...ok(value)})
			return value
		})
		.catch(error => {
			$wait(newWaitErr(error) as Wait<Value, E>)
			return undefined
		})

	return [$derived, done] as const
}

