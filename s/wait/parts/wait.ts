
import {derived, signal} from "@e280/strata"
import {attemptAsync, err, getOk, Result} from "@e280/stz"
import {Wait} from "./type.js"
import {newWait} from "./new.js"

export function wait<Value>(
		input: Promise<Value> | (() => Promise<Value>),
	) {
	return waitResult(attemptAsync(input))
}

export function waitResult<Value, E = unknown>(
		input: Promise<Result<Value, E>> | (() => Promise<Result<Value, E>>),
	) {

	return waitResultPromise<Value, E>(
		(typeof input === "function")
			? input()
			: input
	)
}

function waitResultPromise<Value, E = unknown>(promise: Promise<Result<Value, E>>) {
	const $wait = signal<Wait<Value, E>>(newWait<Value, E>())
	const $derived = derived(() => $wait())

	const done = promise
		.then(result => {
			$wait({done: true, ...result})
			return getOk(result)
		})
		.catch(error => {
			$wait({done: true, ...err(error)})
			return undefined
		})

	return [$derived, done] as const
}

