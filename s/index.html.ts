
import {ssg, html} from "@e280/scute"

const title = "sly"
const description = "mischievous shadow views"
const domain = "sly.e280.org"
const favicon = "/assets/favicon.png"

export default ssg.page(import.meta.url, async orb => ({
	title,
	js: "demo/demo.bundle.min.js",
	css: "demo/demo.css",
	favicon,
	dark: true,
	socialCard: {
		themeColor: "#95ff7b",
		title,
		description,
		siteName: "@e280/sly",
		image: "https://" + domain + favicon,
	},

	head: html`
		<meta name="example" value="whatever"/>
	`,

	body: html`
		<img class=icon alt="" src="/assets/favicon.png"/>
		<h1>sly testing page</h1>
		<p><a href="https://github.com/e280/sly">github.com/e280/sly</a></p>
		<p class=lil>v${orb.packageVersion()}</p>

		<king-component></king-component>
		<queen-component></queen-component>
		<div class=demo></div>

		<incredi-element></incredi-element>
		<divine-element></divine-element>
		<demo-counter initial="-1">component</demo-counter>
	`,
}))

