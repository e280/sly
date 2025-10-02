
import {render} from "lit"
import {el} from "./parts/el.js"
import {mk} from "./parts/mk.js"
import {eve} from "./parts/eve.js"
import {attrs} from "./attrs/attrs.js"
import {elmer} from "./parts/elmer.js"
import {Content} from "../view/types.js"
import {Dom} from "./parts/dom-scope.js"
import {register} from "./parts/register.js"
import {Queryable, Renderable} from "./types.js"
import {queryAll, queryMaybe, queryRequire} from "./parts/queries.js"

export function dom<E extends Element>(selector: string, container: Queryable = document): E {
	return queryRequire<E>(selector, container)
}

dom.in = <E extends HTMLElement>(selectorOrElement: string | E, container: Queryable = document) => {
	return new Dom(container).in(selectorOrElement)
}

dom.require = queryRequire
dom.maybe = queryMaybe
dom.all = queryAll

dom.el = el
dom.elmer = elmer
dom.mk = mk
dom.events = eve
dom.attrs = attrs
dom.register = register
dom.render = (container: Renderable, ...content: Content[]) => {
	return render(content, container)
}

