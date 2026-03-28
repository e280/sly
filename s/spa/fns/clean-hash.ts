
export function cleanHash() {
	const {pathname, search, hash} = window.location
	if (hash === "#" || hash === "#/")
		history.replaceState(null, "", pathname + search)
}

