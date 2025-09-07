
import {dom} from "../dom/dom.js"
import {DemoView} from "./views/demo.js"
import {CounterView} from "./views/counter.js"
import {IncrediElement} from "./views/incredi.js"
import {BackwardsElement} from "./views/backwards.js"

dom.in(".demo").render(DemoView())

dom.register({
	IncrediElement,
	BackwardsElement,
	DemoCounter: CounterView.component(el => [
		dom.attrs(el).number.initial ?? 0,
	]),
})

dom<BackwardsElement>("backwards-element").speed = 2

console.log("🦝 sly")

