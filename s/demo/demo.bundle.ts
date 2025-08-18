
import {$} from "../dom/dollar.js"
import {DemoView} from "./views/demo.js"
import {CounterView} from "./views/counter.js"

$.render($(".demo"), DemoView())

$.register({
	DemoCounter: CounterView.component(1),
})

console.log("🦝 sly")

