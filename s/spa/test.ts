
import {suite, test, expect} from "@e280/science"
import {norm, spa} from "./spa.js"

export default suite({
	"basic routing": test(async() => {
		const router = spa({
			"profile": () => "my-profile",
			"settings": () => "my-settings",
		})
		expect(router("profile")).is("my-profile")
		expect(router("settings")).is("my-settings")
	}),

	"return undefined on unknown routes": test(async() => {
		const router = spa({
			"profile": () => "my-profile",
			"settings": () => "my-settings",
		})
		expect(router("unknown")).is(undefined)
	}),

	"parameters are passed to fn": test(async() => {
		const router = spa({
			"user/{id}": p => "my-user-" + p.id,
		})
		expect(router("user/123")).is("my-user-123")
	}),

	"order matters": test(async() => {
		const router1 = spa({
			"user/a": () => "alpha",
			"user/{id}": () => "bravo",
		})
		expect(router1("user/a")).is("alpha")
		expect(router1("user/123")).is("bravo")
		const router2 = spa({
			"user/{id}": () => "bravo",
			"user/a": () => "alpha",
		})
		expect(router2("user/123")).is("bravo")
		expect(router2("user/a")).is("bravo")
	}),

	"subrouting": test(async() => {
		const subrouter = (p: {id: string}) => spa({
			"profile": () => "my-profile-" + p.id,
			"settings": () => "my-settings-" + p.id,
		})
		const router = spa({
			"user/{id}/{*}": (p, subpath) => subrouter(p)(subpath),
		})
		expect(router("user/123/profile")).is("my-profile-123")
		expect(router("user/123/settings")).is("my-settings-123")
	}),

	"norm": test(async() => {
		const router = spa({
			"": () => "my-home",
			"settings": () => "my-settings",
		})
		expect(router(norm(""))).is("my-home")
		expect(router(norm("/"))).is("my-home")
		expect(router(norm("#"))).is("my-home")
		expect(router(norm("#/"))).is("my-home")
		expect(router(norm("settings"))).is("my-settings")
		expect(router(norm("/settings"))).is("my-settings")
		expect(router(norm("#settings"))).is("my-settings")
		expect(router(norm("#/settings"))).is("my-settings")
	}),
})

