
# `@e280/sly` changelog
- 🟥 breaking change
- 🔶 deprecation or possible breaking change
- 🍏 harmless addition, fix, or enhancement

<br/>

## v0.0

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

