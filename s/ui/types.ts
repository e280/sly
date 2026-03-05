
import {Content} from "../view/types.js"

export {Content}

export type RenderFn<Props extends any[]> = (...props: Props) => Content

export type Viewy = {
	render: () => Promise<void>
}

