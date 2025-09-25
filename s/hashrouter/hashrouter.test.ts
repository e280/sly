
import {Science, test, expect} from "@e280/science"
import {route} from "./plumbing/braces.js"
import {Routes} from "./plumbing/types.js"
import {Hashrouter} from "./hashrouter.js"

async function setup<R extends Routes>(routes: R) {
	const location = {hash: ""}
	const hashrouter = new Hashrouter({
		routes,
		getHash: () => location.hash,
		setHash: hash => { location.hash = hash },
	})
	return {location, hashrouter}
}

export default Science.suite({
	inits: Science.suite({
		"#/": test(async() => {
			const {location, hashrouter} = await setup({
				home: route("#/", async() => "123"),
			})
			expect(hashrouter.content).is(null)
			location.hash = "#/"
			await hashrouter.update()
			expect(hashrouter.content).is("123")
		}),

		"#/hello/world": test(async() => {
			const {location, hashrouter} = await setup({
				helloWorld: route("#/hello/world", async() => "123"),
			})
			expect(hashrouter.content).is(null)
			location.hash = "#/hello/world"
			await hashrouter.update()
			expect(hashrouter.content).is("123")
		}),

		"#/item/a123": test(async() => {
			const {location, hashrouter} = await setup({
				item: route("#/item/{id}", async({id}) => `content ${id}`),
			})
			location.hash = "#/item/a123"
			await hashrouter.update()
			expect(hashrouter.content).is("content a123")
		}),

		"#/item/a123/lol should miss": test(async() => {
			const {location, hashrouter} = await setup({
				item: route("#/item/{id}", async({id}) => `content ${id}`),
			})
			location.hash = "#/item/a123/lol"
			await hashrouter.update()
			expect(hashrouter.content).is(null)
		}),

		"#/left/{mid}/right extraction": test(async() => {
			const {location, hashrouter} = await setup({
				item: route("#/left/{mid}/right", async({mid}) => `content ${mid}`),
			})
			location.hash = "#/left/middle/right"
			await hashrouter.update()
			expect(hashrouter.content).is("content middle")
		}),

		"#/not-found-lol": test(async() => {
			const {location, hashrouter} = await setup({
				helloWorld: route("#/hello/world", async() => "123"),
			})
			location.hash = "#/not-found-lol"
			await hashrouter.update()
			expect(hashrouter.content).is(null)
		}),
	}),

	nav: Science.suite({
		"home to item and back": test(async() => {
			const {location, hashrouter} = await setup({
				home: route("#/", async() => `home`),
				item: route("#/item/{id}", async({id}) => `item ${id}`),
			})
			location.hash = "#/"
			await hashrouter.update()
			expect(hashrouter.content).is("home")
			await hashrouter.nav.item({id: "x234"})
			expect(hashrouter.content).is("item x234")
		}),
	}),
})

