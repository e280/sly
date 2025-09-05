
# `@e280/sly` changelog
- 🟥 breaking change
- 🔶 deprecation or possible breaking change
- 🍏 harmless addition, fix, or enhancement



<br/>

## v0.2

### v0.2.0
- 🍏 add new `loot` drag-and-drop system
- 🟥 rework view rendering syntax
    - 😡 old bad
        ```ts
        CoolView
          .attr("class", "hero")
          .children(html`<em>spongebob</em>`)
          .props("hello")
        ```
    - 🤗 new good
        ```ts
        CoolView.props("hello")
          .attr("class", "hero")
          .children(html`<em>spongebob</em>`)
          .render()
        ```
- 🟥 rename view.view to view.declare
    - 😡 old bad
        ```ts
        view.settings(s).view(fn)
        ```
    - 🤗 new good
        ```ts
        view.settings(s).declare(fn)
        ```
- 🟥 upgraded to `strata` v0.2.0 (see [strata changelog](https://github.com/e280/strata/blob/main/CHANGELOG.md)
  - 🟥 using new signals integration
  - 🍏 added `use` hooks:
    - `use.derive(f)`
    - `use.lazy(f)`
    - `use.signal.derive(f)`
    - `use.signal.lazy(f)`
- 🟥 replace `$` multitool with new `dom` tool
    - 🟥 rename `Container` type to `Renderable`
- 🟥 renames in ops
    - 🟥 rename `Op.fn` type to `Op.load`
    - 🟥 rename `op.fn` type to `op.load`
    - 🟥 rename `use.op.fn` type to `use.op.load`



<br/>

## v0.1

### v0.1.1
- 🍏 make stz and strata regular `dependencies` (they used to be peer dependencies), because those packages can tolerate your runtime having multiple version of those libraries.. however `lit` is still a *peer dependency*, because it apparently cannot tolerate mixing among multiple copies of the library
- 🍏 update dependencies

### v0.1.0
- 🍏 moving to version range that allows non-breaking patches
- 🍏 update dependencies



<br/>

## v0.0

### v0.0.1
- 🍏 add alias `use.css` for `use.styles`

### v0.0.0
- 🍏 update dependencies
- 🔶 adapt to new strata tracker which is incompatible with the old one

### v0.0.0-9
- 🍏 fix `use.op.fn` type
- 🍏 improve readme

### v0.0.0-8
- 🍏 add `use.wake`
- 🍏 add `use.attrs` and `attributes` and `onAttrChange`
- 🍏 fix `await op.wait` and make `await op` equivalent
- 🍏 add `use.op(f)` as alias to `use.op.fn(f)`
- 🟥 `use.render()` is now debounced (and the new `use.renderNow()` is not)
- 🟥 `op.morph` now returns a pod, not an op
- 🟥 `op.all` now returns a pod, not an op

### v0.0.0-7
- 🍏 implement web components via `view.component`

### v0.0.0-6
- 🟥 rework some loader anims, see new loaders on the testing page

### v0.0.0-5
- 🟥 rename `pod` to `podium`
- 🍏 add: `op.morph`, `Op.all`, `podium.morph`, `podium.all`
- 🍏 add: makeLoader and loader anims
- 🍏 add: `use.render`
- 🍏 improve: Op ergonomics
  - add type arg to `Op.loading<V>()` and `Op.error<V>(e)`
  - add getters `op.isLoading`, `op.isReady`, `op.isError`
  - add `error` getter, (also `pod.error`)

### v0.0.0-4
- 🍏 fix: view types, view `.children` takes rest param for multiple children
- 🍏 add: `use.life`
- 🍏 add: `$.render(element, content)`

### v0.0.0-3
- 🍏 initial release

