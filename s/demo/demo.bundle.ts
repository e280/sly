
import {nap, repeat} from "@e280/stz"
import {dom} from "../dom/dom.js"
import {DemoView} from "./views/demo.js"
import {KingComponent, KingView, QueenComponent} from "./views/king.js"
import {CounterView} from "./views/counter.js"
import {DivineElement} from "./views/divine.js"
import {IncrediElement} from "./views/incredi.js"

// dom.register({KingComponent})
// console.log("AAA")
// const component = new KingComponent()
// console.log("BBB")

dom.in(".demo").render(
	KingView.props(99)
		.attr("hello", "world")
		.render()
)

dom.register({
	KingComponent,
	QueenComponent,
	// IncrediElement,
	// DivineElement,
	// DemoCounter: CounterView
	// 	.component()
	// 	.props(c => [dom.attrs(c).number.initial ?? 0]),
})

// const divine = dom<DivineElement>("divine-element")
//
// repeat(async() => {
// 	await nap(1000)
// 	divine.$speed.value++
// })

console.log("🦝 sly")

