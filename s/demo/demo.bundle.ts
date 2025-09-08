
import {dom} from "../dom/dom.js"
import {CounterComponent} from "./views/counter.js"
import {DemoComponent} from "./views/demo.js"
import {FastcountElement} from "./views/fastcount.js"

dom.register({
	DemoComponent,
	CounterComponent,
	FastcountElement,
})

console.log("🦝 sly")

