
import {GMap} from "@e280/stz"
import {Mounts} from "../use-mount.js"
import {LightCx, ShadowCx} from "../../types.js"

export class Scope {
	position = 0
	values = new GMap<number, any>()
	mounts = new Mounts()
	constructor(public cx: LightCx | ShadowCx) {}
}

