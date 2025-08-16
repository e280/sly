
import {ssg, html} from "@e280/scute"

const title = "sly"
const description = "shadow views lit framework"
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
		<h1>sly</h1>
		<p class=lil>v${orb.packageVersion()}</p>
		<div class=demo></div>
		<p><a href="https://github.com/e280/sly">github.com/e280/sly</a></p>
	`,
}))

