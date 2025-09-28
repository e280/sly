
import {ob} from "@e280/stz"
import {View, ViewsDropFirstParam} from "../types.js"

export function provideFirstParamToViews<P, Vs extends {[key: string]: View<any[]>}>(
		param: P,
		views: Vs,
	): ViewsDropFirstParam<Vs> {

	return (
		ob(views)
			.map(view => view.transmute((...p: any[]) => [param, ...p]) as any)
	)
}

