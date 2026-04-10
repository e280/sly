
export type Wait<Value, Fail extends string = string>
	= ["pending"]
	| ["done", Value]
	| ["failed", Fail]

