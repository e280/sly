
import {dom} from "../dom/dom.js"
import {DemoView} from "./views/demo.js"
import {CounterView} from "./views/counter.js"
import {IncrediElement} from "./views/incredi.js"

dom.in(".demo").render(DemoView())

dom.register({
	IncrediElement,
	DemoCounter: CounterView.component(1),
})

console.log("🦝 sly")

