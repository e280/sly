
import {DropFirst, ob} from "@e280/stz"
import {ComponentClass, View, ViewProps} from "../types.js"

export function contextualizeView<C, V extends View<any[]>>(
		context: C,
		view: V,
	): View<DropFirst<ViewProps<V>>> {
	return view.transmute((...p: any[]) => [context, ...p]) as any
}

export function contextualizeViews<C, Vs extends Record<string, View<any[]>>>(
		context: C,
		views: Vs,
	): {[K in keyof Vs]: View<DropFirst<ViewProps<Vs[K]>>>} {

	return ob(views)
		.map(view => contextualizeView(context, view))
}

export function getViews<
		Cs extends Record<string, ComponentClass<any, any>>
	>(components: Cs) {

	return ob(components).map(C => C.view as any) as {
		[K in keyof Cs]: View<DropFirst<ViewProps<Cs[K]["view"]>>>
	}
}

export function contextualizeComponents<
		C,
		Cs extends Record<string, ComponentClass<any, any>>
	>(context: C, originalComponents: Cs) {

	return ob(originalComponents).map((Cons: any) => class extends Cons {
		context = context
		static view = contextualizeView(context, super.view) as any
	}) as any as {
		[K in keyof Cs]: ComponentClass<
			Cs[K],
			DropFirst<ViewProps<Cs[K]["view"]>>
		>
	}
}

