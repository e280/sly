
import {template, html, easypage, headScripts, git_commit_hash, read_file, read_json, unsanitized, renderSocialCard} from "@benev/turtle"

const domain = "sly.e280.org"
const favicon = "/assets/favicon.png"
const version = (await read_json("package.json")).version

export default template(async basic => {
	const path = basic.path(import.meta.url)
	const hash = await git_commit_hash()
	// const faviconVersioned = await path.version.root(favicon)

	// <link rel="icon" href="${faviconVersioned}"/>

	return easypage({
		path,
		dark: true,
		title: "@e280/sly",
		head: html`
			<style>${unsanitized(await read_file("x/demo/demo.css"))}</style>
			<meta data-commit-hash="${hash}"/>
			<meta data-version="${version}"/>

			${renderSocialCard({
				themeColor: "#ff9b00",
				siteName: domain,
				title: "@e280/sly",
				description: "web shadow view library",
				image: `https://${domain}${favicon}`,
			})}

			${headScripts({
				devModulePath: await path.version.local("demo/demo.bundle.js"),
				prodModulePath: await path.version.local("demo/demo.bundle.min.js"),
				importmapContent: await read_file("x/importmap.json"),
			})}
		`,
		body: html`
			<h1>sly demo</h1>
		`,
	})
})

