
import {signal} from "@e280/strata"

export type PendPending = ["pending"]
export type PendValue<Value> = ["value", Value]
export type PendErr<Err extends string = string> = ["err", Err]
export type Pend<Value, Err extends string = string> = PendPending | PendValue<Value> | PendErr<Err>

export class Wait<Value, Err extends string = string> {
	#pend = signal<Pend<Value, Err>>(["pending"])

	get pend() {
		return this.#pend()
	}

	set pend(pend: Pend<Value, Err>) {
		this.#pend(pend)
	}

	setPending() {
		this.pend = ["pending"]
	}

	setValue(value: Value) {
		this.pend = ["value", value]
		return value
	}

	setErr(err: Err) {
		this.pend = ["err", err]
		return err
	}

	isPending() { return this.pend[0] === "pending" }
	isValue() { return this.pend[0] === "value" }
	isErr() { return this.pend[0] === "err" }

	get() {
		const {pend} = this
		return pend[0] === "value"
			? pend[1]
			: undefined
	}

	need() {
		const {pend} = this
		if (pend[0] !== "value")
			throw new Error("wait value not ready")
		return pend[1]
	}

	static async fn<Value, Err extends string = string>(fn: () => Promise<Value>) {
		return await this.promise<Value, Err>(fn())
	}

	static async promise<Value, Err extends string = string>(promise: Promise<Value>) {
		const wait = new this<Value, Err>()
		wait.setPending()
		try { return wait.setValue(await promise) }
		catch (error) {
			if (typeof error === "string")
				wait.setErr(error as Err)
			else if (error instanceof Error)
				wait.setErr(error.message as Err)
			else
				wait.setErr("error" as Err)
		}
	}
}

