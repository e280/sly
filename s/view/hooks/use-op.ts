
import {Op} from "../../op/op.js"
import {useOnce} from "./use-once.js"

export function useOp<Value>(fn: () => Promise<Value>) {
	return useOnce(() => Op.load(fn))
}

export function useOpPromise<Value>(promise: Promise<Value>) {
	return useOnce(() => Op.promise(promise))
}

