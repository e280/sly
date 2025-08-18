
import {DemoView} from "./views/demo.js"
import {$} from "../dom/dollar.js"
import {CounterView} from "./views/counter.js"
import { Op } from "../ops/op.js"
import { nap } from "@e280/stz"

$.render($(".demo"), DemoView())

$.register({
	DemoCounter: CounterView.component(1),
})

console.log("🦝 sly")

const op = Op.fn(async() => {
	await nap(1000)
	console.log("a")
	return 123
})

op.wait.then(() => console.log("b"))
console.log("c", await op)

