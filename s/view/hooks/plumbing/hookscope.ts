
import {Mounts} from "../use-mount.js"
import {LightCx, ShadowCx} from "../../parts/cx.js"

export class Hookscope {
	position = 0
	values = new Map<number, any>()
	mounts = new Mounts()
	constructor(public cx: LightCx | ShadowCx) {}
}

