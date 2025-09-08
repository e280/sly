
import {AttrValue, Content} from "../../types.js"

/** the information we need to render a view. */
export class ViewContext<Props extends any[]> {
	attrs = new Map<string, AttrValue>()
	children: Content[] = []
	constructor(public props: Props) {}
}

