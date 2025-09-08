
import {AttrValue, Content} from "../../types.js"

export class ViewContext<Props extends any[]> {
	attrs = new Map<string, AttrValue>()
	children: Content[] = []
	constructor(public props: Props) {}
}

