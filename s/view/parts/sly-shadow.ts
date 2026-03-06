
export class SlyShadow extends HTMLElement {
	connectedCallback() {
		if (!this.hasAttribute("view"))
			this.setAttribute("view", "")
	}
}

