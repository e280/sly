
import {html} from "lit"
import {dom} from "../../dom/dom.js"
import {componentize} from "../../views/component.js"
import {BaseElement} from "../../views/base-element.js"

export class KingComponent extends (componentize()
	.base(class extends BaseElement {
		attrs = dom.attrs(this).spec({start: Number})
	})
	.props<[start: number]>(component => [component.attrs.start ?? 0])
	.render(use => start => {
		const $count = use.signal(start)
		const increment = () => $count($count() + 1)
		return html`
			<span>${$count()}</span>
			<button @click="${increment}">++</button>
		`
	})
) {}

export const KingView = KingComponent.view

// export class KingComponent extends Component<[start: number]> {
// 	attrs = dom.attrs(this).spec({start: Number})
// 	props = this.asProps(() => [0])
// 	fn(use: Use) {
// 		return (start: number) => {
// 			const $count = use.signal(start)
// 			const increment = () => $count($count() + 1)
// 			return html`
// 				<span>KING</span>
// 				<span>${$count()}</span>
// 				<button @click="${increment}">+</button>
// 			`
// 		}
// 	}
// }
//
// export const KingView = viewize(KingComponent)

