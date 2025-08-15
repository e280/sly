
import {ssg, html} from "@e280/scute"

const title = "sly"
const description = "shadow views lit framework"
const domain = "sly.e280.org"
const favicon = "/assets/favicon.png"

export default ssg.page(import.meta.url, async orb => ({
	title,
	js: "demo/demo.bundle.min.js",
	css: "demo/demo.css",
	// favicon,
	dark: true,
	socialCard: {
		themeColor: "#ff9b00",
		title,
		description,
		siteName: domain,
		image: domain + favicon,
	},

	head: html`
		<meta name="example" value="whatever"/>
	`,

	body: html`
		<h1>sly ${orb.packageVersion()}</h1>
		<sly-demo></sly-demo>
	`,
}))

