
import {render} from "lit"
import {dom} from "../dom.js"
import {Renderable} from "../types.js"
import {Content} from "../../view/types.js"

export function renderIn(container: string | Renderable, content: Content) {
	return render(content, typeof container === "string"
		? dom(container)
		: container)
}

