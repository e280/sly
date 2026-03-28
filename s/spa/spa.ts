
const settings = spa({
	"profile": () => "myProfile",
	"billing": () => "myBilling",
	"theme": () => "myTheme",
})

const router = spa({
	"#/": () => "myHome",
	"#/settings/{*}": settings,
})

router("#/settings/profile") // "myProfile"



