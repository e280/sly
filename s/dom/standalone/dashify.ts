
/** convert "CamelCaseName" into "camel-case-name". */
export function dashify(camel: string) {
	return camel.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()
}

