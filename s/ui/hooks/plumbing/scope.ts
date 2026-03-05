
import {GMap} from "@e280/stz"
import {Heart} from "./heart.js"
import {Ref} from "../use-ref.js"
import {Mounts} from "../use-mount.js"

export class Scope {
	position = 0
	values = new GMap<number, any>()
	refs = new GMap<number, Ref<any>>()
	mounts = new Mounts()
	constructor(public heart: Heart) {}
}

