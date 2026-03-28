
/** strip off leading slashes or hash-slash shenanigans */
export function norm(path: string): string {
	if (path.startsWith("#"))
		path = path.slice(1)

	while (path.startsWith("/"))
		path = path.slice(1)

	return path
}

