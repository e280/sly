
import {dom} from "../dom/dom.js"
import {DemoView} from "./views/demo.js"
import {CounterView} from "./views/counter.js"

dom.in(".demo").render(DemoView())
dom.register({DemoCounter: CounterView.component(1)})

console.log("🦝 sly")

