
import {Science, test, expect} from "@e280/science"
import {route} from "./plumbing/braces.js"
import {Routes} from "./plumbing/types.js"
import {RouterCore} from "./plumbing/router-core.js"

async function setup<R extends Routes>(routes: R) {
	const location = {hash: ""}
	const router = new RouterCore(routes, location)
	return {location, router}
}

export default Science.suite({
	inits: Science.suite({
		"#/": test(async() => {
			const {location, router} = await setup({
				home: route("#/", async() => "123"),
			})
			expect(router.content).is(null)
			location.hash = "#/"
			await router.refresh()
			expect(router.content).is("123")
		}),

		"#/hello/world": test(async() => {
			const {location, router} = await setup({
				helloWorld: route("#/hello/world", async() => "123"),
			})
			expect(router.content).is(null)
			location.hash = "#/hello/world"
			await router.refresh()
			expect(router.content).is("123")
		}),

		"#/item/a123": test(async() => {
			const {location, router} = await setup({
				item: route("#/item/{id}", async({id}) => `content ${id}`),
			})
			location.hash = "#/item/a123"
			await router.refresh()
			expect(router.content).is("content a123")
		}),

		"#/item/a123/lol should miss": test(async() => {
			const {location, router} = await setup({
				item: route("#/item/{id}", async({id}) => `content ${id}`),
			})
			location.hash = "#/item/a123/lol"
			await router.refresh()
			expect(router.content).is(null)
		}),

		"#/left/{mid}/right extraction": test(async() => {
			const {location, router} = await setup({
				item: route("#/left/{mid}/right", async({mid}) => `content ${mid}`),
			})
			location.hash = "#/left/middle/right"
			await router.refresh()
			expect(router.content).is("content middle")
		}),

		"#/not-found-lol": test(async() => {
			const {location, router} = await setup({
				helloWorld: route("#/hello/world", async() => "123"),
			})
			location.hash = "#/not-found-lol"
			await router.refresh()
			expect(router.content).is(null)
		}),
	}),

	nav: Science.suite({
		"home to item and back": test(async() => {
			const {location, router} = await setup({
				home: route("#/", async() => `home`),
				item: route("#/item/{id}", async({id}) => `item ${id}`),
			})
			location.hash = "#/"

			await router.refresh()
			expect(router.content).is("home")

			await router.nav.item.go({id: "x234"})
			expect(router.content).is("item x234")

			await router.nav.home.go()
			expect(router.content).is("home")
		}),
	}),
})

