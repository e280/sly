
import {nap, repeat} from "@e280/stz"
import {dom} from "../dom/dom.js"
import {DemoView} from "./views/demo.js"
import {CounterView} from "./views/counter.js"
import {DivineElement} from "./views/divine.js"
import {IncrediElement} from "./views/incredi.js"

dom.in(".demo").render(DemoView())

dom.register({
	IncrediElement,
	DivineElement,
	DemoCounter: CounterView
		.component()
		.props(c => [dom.attrs(c).number.initial ?? 0]),
})

const divine = dom<DivineElement>("divine-element")

repeat(async() => {
	await nap(1000)
	divine.$speed.value = 2
})

console.log("🦝 sly")

