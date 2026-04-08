
import {suite, test, expect} from "@e280/science"
import {norm} from "./fns/norm.js"
import {router} from "./fns/router.js"

export default suite({
	"basic routing": test(async() => {
		const route = router({
			"profile": () => "my-profile",
			"settings": () => "my-settings",
		})
		expect(route("profile")).is("my-profile")
		expect(route("settings")).is("my-settings")
	}),

	"return undefined on unknown routes": test(async() => {
		const route = router({
			"profile": () => "my-profile",
			"settings": () => "my-settings",
		})
		expect(route("unknown")).is(undefined)
	}),

	"params are passed to fn": test(async() => {
		const route = router({
			"user/{id}": p => "my-user-" + p.id,
		})
		expect(route("user/123")).is("my-user-123")
	}),

	"two params": test(async() => {
		const route = router({
			"user/{id}/{mode}": p => `my-user-${p.id}-${p.mode}`,
		})
		expect(route("user/123/active")).is("my-user-123-active")
	}),

	"order matters": test(async() => {
		const r1 = router({
			"user/a": () => "alpha",
			"user/{id}": () => "bravo",
		})
		expect(r1("user/a")).is("alpha")
		expect(r1("user/123")).is("bravo")
		const r2 = router({
			"user/{id}": () => "bravo",
			"user/a": () => "alpha",
		})
		expect(r2("user/123")).is("bravo")
		expect(r2("user/a")).is("bravo")
	}),

	"subrouting": test(async() => {
		const subroute = (p: {id: string}) => router({
			"profile": () => "my-profile-" + p.id,
			"settings": () => "my-settings-" + p.id,
		})
		const route = router({
			"user/{id}/{*}": (p, subpath) => subroute(p)(subpath),
		})
		expect(route("user/123/profile")).is("my-profile-123")
		expect(route("user/123/settings")).is("my-settings-123")
	}),

	"star gives empty string when empty": test(async() => {
		const route = router({
			"user/{id}/{*}": (_p, subpath) => subpath,
		})
		expect(route("user/123/")).is("")
	}),

	"explicit path vs star": test(async() => {
		const route = router({
			"user/{id}/": _p => "normal",
			"user/{id}/{*}": _p => "subpath",
		})
		expect(route("user/123/")).is("normal")
		expect(route("user/123/a")).is("subpath")
	}),

	"norm": test(async() => {
		const route = router({
			"": () => "my-home",
			"settings": () => "my-settings",
		})
		expect(route(norm(""))).is("my-home")
		expect(route(norm("/"))).is("my-home")
		expect(route(norm("#"))).is("my-home")
		expect(route(norm("#/"))).is("my-home")
		expect(route(norm("settings"))).is("my-settings")
		expect(route(norm("/settings"))).is("my-settings")
		expect(route(norm("#settings"))).is("my-settings")
		expect(route(norm("#/settings"))).is("my-settings")
	}),
})

