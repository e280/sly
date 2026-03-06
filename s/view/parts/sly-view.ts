
export class SlyView extends HTMLElement {
	connectedCallback() {
		if (!this.hasAttribute("view"))
			this.setAttribute("view", "")
	}
}

