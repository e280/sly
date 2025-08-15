
import {css, html, render} from "lit"
import {$} from "../features/dom/dollar.js"
import {shadowView} from "../features/views/shadow-view.js"

console.log("🦝 sly")

const MyView = shadowView
	.settings({name: "my-view", styles: css`:host {color: green;}`})
	.view(_use => (greeting: string) => html`${greeting} <slot></slot>`)

render(MyView.content("world")("hello"), $(".demo"))

