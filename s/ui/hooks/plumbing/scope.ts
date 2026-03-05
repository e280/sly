
import {GMap} from "@e280/stz"
import {Viewy} from "../../types.js"
import {Mounts} from "../use-mount.js"

export class Scope {
	position = 0
	values = new GMap<number, any>()
	mounts = new Mounts()
	constructor(public view: Viewy) {}
}

