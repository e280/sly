
import {dom} from "../dom/dom.js"
import {Demo} from "./views/demo.js"
import {TimeLight} from "./views/time-light.js"
import {TimeShadow} from "./views/time-shadow.js"

dom.register({TimeShadow, TimeLight})

dom.in(".demo").render(Demo())
console.log("🦝 sly")

