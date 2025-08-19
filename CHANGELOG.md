
# `@e280/sly` changelog
- 🟥 breaking change
- 🔶 deprecation or possible breaking change
- 🍏 harmless addition, fix, or enhancement

<br/>

## v0.0

### v0.0.0-9
- 🍏 fix `use.op.fn` type

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

