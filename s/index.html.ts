
import {template, html, socialCard} from "@e280/scute"

export default template(import.meta.url, async orb => html`
	<!doctype html>
	<html>
		<head>
			<meta charset="utf-8"/>
			<meta name="viewport" content="width=device-width,initial-scale=1"/>
			<meta name="darkreader-lock"/>
			<style>@layer base{html{background:#000}}</style>

			<title>sly</title>
			<link rel="icon" href="/assets/favicon.png"/>
			<link rel="stylesheet" href="${orb.hashurl("demo/demo.css")}"/>
			<script type="module" src="${orb.hashurl("demo/demo.bundle.min.js")}"></script>

			${socialCard({
				themeColor: "#95ff7b",
				title: "sly",
				description: "mischievous shadow views",
				siteName: "@e280/sly",
				image: "https://sly.e280.org/assets/favicon.png",
			})}
		</head>
		<body>
			<img class=icon alt="" src="/assets/favicon.png"/>
			<h1>sly testing page</h1>
			<p><a href="https://github.com/e280/sly">github.com/e280/sly</a></p>
			<p class=lil>v${orb.packageVersion()}</p>
			<div class="demo"></div>
		</body>
	</html>
`)

