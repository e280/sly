
import {Op} from "../../deprecated/op/op.js"
import {useOnce} from "./use-once.js"

/** @deprecated use `useWait` instead */
export function useOp<Value>(fn: () => Promise<Value>) {
	return useOnce(() => Op.load(fn))
}

/** @deprecated use `useWait` instead */
export function useOpPromise<Value>(promise: Promise<Value>) {
	return useOnce(() => Op.promise(promise))
}

