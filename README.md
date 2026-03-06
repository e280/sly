
<div align="center"><img alt="" width="256" src="./assets/favicon.png"/></div>

# 🦝 sly
> *mischievous shadow views*

```sh
npm install lit @e280/sly @e280/strata @e280/stz
```

[@e280](https://e280.org/)'s new [lit](https://lit.dev/)-based frontend webdev library.

- 🍋 [**#views**](#views) — hooks-based, shadow-dom'd, template-literal'd
- 🪝 [**#hooks**](#hooks) — full reference of available view hooks
- 🫛 [**#ops**](#ops) — reactive tooling for async operations
- ⏳ [**#loaders**](#loaders) — animated loading spinners for rendering ops
- 🪙 [**#loot**](#loot) — drag-and-drop facilities
- 🪄 [**#dom**](#dom) — the "it's not jquery" multitool
- 🧪 https://sly.e280.org/ — our testing page



<br/><br/>
<a id="views"></a>

## 🍋 views
> *modern views.. in lightness, or darkness..*  

- 🪶 **no compile step** — just god's honest javascript, via [lit](https://lit.dev/)-html tagged-template-literals
- ⚡ **reactive** — views auto-rerender whenever any [strata](https://github.com/e280/strata)-compatible state changes
- 🪝 **hooks-based** — declarative rendering with [modern hooks](#hooks) familiar to react devs

```ts
import {html} from "lit"
import {light, shadow, dom} from "@e280/sly"

export const MyLightView = light(() => html`<p>blinded by the light</p>`)

export const MyShadowView = shadow(() => html`<p>shrouded in darkness</p>`)
```

### 🌞 light views
> *just pretend it's react*

- **define a light view**
    ```ts
    import {html} from "lit"
    import {light, useSignal} from "@e280/sly"

    export const MyCounter = light((start: number) => {
      const $count = useSignal(start)
      const increment = () => $count.value++

      return html`
        <button @click="${increment}">${$count.value}</button>
      `
    })
    ```
- **render it into the dom**
    ```ts
    dom.in(".demo").render(html`
      <h1>my cool counter demo</h1>
      ${MyCounter(123)}
    `)
    ```

### 🌚 shadow views
> *each shadow view gets its own cozy [shadow-dom](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM) bubble and supports [slots](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots)*

- **define a shadow view**
    ```ts
    import {css, html} from "lit"
    import {shadow, useName, useCss, useSignal} from "@e280/sly"

    export const MyShadowCounter = shadow((start: number) => {
      useName("shadow-counter")
      useCss(css`button { color: cyan }`)

      const $count = useSignal(start)
      const increment = () => $count.value++

      return html`
        <button @click="${increment}">${$count()}</button>
        <slot></slot>
      `
    })
    ```
- **render it into the dom**
    ```ts
    dom.in(".demo").render(html`
      <h1>my cool counter demo</h1>
      ${MyShadowCounter(234)}
    `)
    ```
- **.with to nest children or set attrs**
    ```ts
    dom.in(".demo").render(html`
      <h1>my cool counter demo</h1>

      ${MyShadowCounter.with({
        props: [234],
        attrs: {"data-whatever": 555},
        children: html`
          <p>woah, slotting support!</p>
        `,
      })}
    `)
    ```
- **oh, you can do custom shadow config if needed**
    ```ts
    const MyCustomShadow = shadow.config(() => {
      const host = document.createElement("div")
      const shadow = host.attachShadow({mode: "open"})
      return {host, shadow}
    })(() => html`<p>shrouded in darkness</p>`)
    ```



<br/><br/>
<a id="hooks"></a>

## 🪝 hooks
> *composable view state and utilities*  

### 👮 follow the hooks rules

just like [react hooks](https://react.dev/warnings/invalid-hook-call-warning), the execution order of sly's `use` hooks actually matters.

you must not call these hooks under `if` conditionals, or `for` loops, or in callbacks, or after a conditional `return` statement, or anything like that.. *otherwise, heed my warning: weird bad stuff will happen..*

### 🌚 shadow-only hooks
- **useName** — *(shadow only)* — set the "view" attribute value
    ```ts
    useName("squarepants")
      // <sly-shadow view="squarepants">
    ```
- **useCss** — *(shadow only)*  — attach stylesheets (use lit's `css`!) to the shadow root
    ```ts
    useCss(css1, css2, css3)
    ```
- **useHost** — *(shadow only)*  — get the host element
    ```ts
    const host = useHost()
    ```
- **useShadow** — *(shadow only)*  — get the shadow root
    ```ts
    const shadow = useShadow()
    ```

### 🌞 universal hooks
- **useState** — react-like hook to create some reactive state (we prefer signals)
    ```ts
    const [count, setCount] = useState(0)

    const increment = () => setCount(n => n + 1)
    ```
- **useRef** — react-like hook to make a non-reactive box for a value
    ```ts
    const ref = useRef(0)

    ref.current // 0
    ref.current = 1 // does not trigger rerender
    ```
- **useSignal** — create a [strata](https://github.com/e280/strata) signal
    ```ts
    const $count = useSignal(1)

    // read the signal
    $count()

    // write the signal
    $count(2)
    ```
    - see [strata readme](https://github.com/e280/strata)
- **useDerived** — create a [strata](https://github.com/e280/strata) derived signal
    ```ts
    const $product = useDerived(() => $count() * $whatever())
    ```
    - see [strata readme](https://github.com/e280/strata)
- **useOnce** — run fn at initialization, and return a value
    ```ts
    const whatever = useOnce(() => {
      console.log("happens one time")
      return 123
    })

    whatever // 123
    ```
- **useMount** — setup mount/unmount lifecycle
    ```ts
    useMount(() => {
      console.log("mounted")
      return () => console.log("unmounted")
    })
    ```
- **useWake** — run fn each time mounted, and return value
    ```ts
    const whatever = useWake(() => {
      console.log("mounted")
      return 123
    })

    whatever // 123
    ```
- **useLife** — mount/unmount lifecycle, but also return a value
    ```ts
    const whatever = useLife(() => {
      console.log("mounted")
      const value = 123
      return [value, () => console.log("unmounted")]
    })

    whatever // 123
    ```
- **useRender** — returns a fn to rerender the view (debounced)
    ```ts
    const render = useRender()

    render().then(() => console.log("render done"))
    ```
- **useRendered** — get a promise that resolves *after* the next render
    ```ts
    useRendered().then(() => console.log("rendered"))
    ```
- **useOp** — start loading an op based on an async fn
    ```ts
    const op = useOp(async() => {
      await nap(5000)
      return 123
    })
    ```
- **useOpPromise** — start loading an op based on a promise
    ```ts
    const op = useOpPromise(doAsyncWork())
    ```

### 🧑‍🍳 happy hooks recipes
- make a ticker — mount, cycle, and nap
    ```ts
    import {cycle, nap} from "@e280/stz"
    ```
    ```ts
    const $seconds = useSignal(0)

    useMount(() => cycle(async() => {
      await nap(1000)
      $seconds.value++
    }))
    ```
- wake + rendered, to do something after each mount's first render
    ```ts
    useWake(() => useRendered.then(() => {
      console.log("after first render")
    }))
    ```



<br/><br/>
<a id="ops"></a>

## 🫛 ops
> *tools for async operations and loading spinners*  

```ts
import {nap} from "@e280/stz"
import {Pod, podium, Op, loaders} from "@e280/sly"
```

### 🫛 pods: loading/ready/error
- a pod represents an async operation in terms of json-serializable data
- there are three kinds of `Pod<V>`
    ```ts
    // loading pod
    ["loading"]

    // ready pod contains value 123
    ["ready", 123]

    // error pod contains an error
    ["error", new Error()]
    ```

### 🫛 podium: helps you work with pods
- get pod status
    ```ts
    podium.status(["ready", 123])
      // "ready"
    ```
- get pod ready value (or undefined)
    ```ts
    podium.value(["loading"])
      // undefined

    podium.value(["ready", 123])
      // 123
    ```
- see more at [podium.ts](./s/ops/podium.ts)

### 🫛 ops: nice pod ergonomics
- an `Op<V>` wraps a pod with a signal for reactivity
- create an op
    ```ts
    const op = new Op<number>() // loading status by default
    ```
    ```ts
    const op = Op.loading<number>()
    ```
    ```ts
    const op = Op.ready<number>(123)
    ```
    ```ts
    const op = Op.error<number>(new Error())
    ```
- 🔥 create an op that calls and tracks an async fn
    ```ts
    const op = Op.load(async() => {
      await nap(4000)
      return 123
    })
    ```
- await for the next ready value (or thrown error)
    ```ts
    await op // 123
    ```
- get pod info
    ```ts
    op.pod // ["loading"]
    op.status // "loading"
    op.value // undefined (or value if ready)
    ```
    ```ts
    op.isLoading // true
    op.isReady // false
    op.isError // false
    ```
- select executes a fn based on the status
    ```ts
    const result = op.select({
      loading: () => "it's loading...",
      ready: value => `dude, it's ready! ${value}`,
      error: err => `dude, there's an error!`,
    })

    result
      // "dude, it's ready! 123"
    ```
- morph returns a new pod, transforming the value if ready
    ```ts
    op.morph(n => n + 1)
      // ["ready", 124]
    ```
- you can combine a number of ops into a single pod like this
    ```ts
    Op.all(Op.ready(123), Op.loading())
      // ["loading"]
    ```
    ```ts
    Op.all(Op.ready(1), Op.ready(2), Op.ready(3))
      // ["ready", [1, 2, 3]]
    ```
    - error if any ops are in error, otherwise
    - loading if any ops are in loading, otherwise
    - ready if all the ops are ready



<br/><br/>
<a id="loaders"></a>

## ⏳ loaders
> *animated loading spinners for ops*  

```ts
import {loaders} from "@e280/sly"
```

### ⏳ make a loader, choose an anim
- create a loader fn
    ```ts
    const loader = loaders.make(loaders.anims.dots)
    ```
    - see all the anims available on the testing page https://sly.e280.org/
    - ngl, i made too many.. *i was having fun, okay?*

### ⏳ render an op with it
- use your loader to render an op
    ```ts
    return html`
      <h2>cool stuff</h2>

      ${loader(op, value => html`
        <div>${value}</div>
      `)}
    `
    ```
    - when the op is loading, the loading spinner will animate
    - when the op is in error, the error will be displayed
    - when the op is ready, your fn is called and given the value



<br/><br/>
<a id="loot"></a>

## 🪙 loot
> *drag-and-drop facilities*  

```ts
import {loot, view, dom} from "@e280/sly"
import {ev} from "@e280/stz"
```

### 🪙 `loot.Drops`
> *accept the user dropping stuff like files onto the page*
- **setup drops**
    ```ts
    const drops = new loot.Drops({
      predicate: loot.hasFiles,
      acceptDrop: event => {
        const files = loot.files(event)
        console.log("files dropped", files)
      },
    })
    ```
- **attach event listeners to your dropzone,** one of these ways:
  - **view example**
      ```ts
      light(() => html`
        <div
          ?data-indicator="${drops.$indicator()}"
          @dragover="${drops.dragover}"
          @dragleave="${drops.dragleave}"
          @drop="${drops.drop}">
            my dropzone
        </div>
      `)
      ```
  - **vanilla-js whole-page example**
      ```ts
      // attach listeners to the body
      ev(document.body, {
        dragover: drops.dragover,
        dragleave: drops.dragleave,
        drop: drops.drop,
      })

      // sly attribute handler for the body
      const attrs = dom.attrs(document.body).spec({
        "data-indicator": Boolean,
      })

      // sync the data-indicator attribute
      drops.$indicator.on(bool => attrs["data-indicator"] = bool)
      ```
- **flashy css indicator for the dropzone,** so the user knows your app is eager to accept the drop
    ```css
    [data-indicator] {
      border: 0.5em dashed cyan;
    }
    ```

### 🪙 `loot.DragAndDrops`
> *setup drag-and-drops between items within your page*
- **declare types for your draggy and droppy things**
    ```ts
    // money that can be picked up and dragged
    type Money = {value: number}
      // dnd will call this a "draggy"

    // bag that money can be dropped into
    type Bag = {id: number}
      // dnd will call this a "droppy"
    ```
- **make your dnd**
    ```ts
    const dnd = new loot.DragAndDrops<Money, Bag>({
      acceptDrop: (event, money, bag) => {
        console.log("drop!", {money, bag})
      },
    })
    ```
- **attach dragzone listeners** (there can be many dragzones...)
    ```ts
    light(() => {
      const money = useOnce((): Money => ({value: 280}))
      const dragzone = useOnce(() => dnd.dragzone(() => money))

      return html`
        <div
          draggable="${dragzone.draggable}"
          @dragstart="${dragzone.dragstart}"
          @dragend="${dragzone.dragend}">
            money ${money.value}
        </div>
      `
    })
    ```
- **attach dropzone listeners** (there can be many dropzones...)
    ```ts
    light(() => {
      const bag = useOnce((): Bag => ({id: 1}))
      const dropzone = useOnce(() => dnd.dropzone(() => bag))
      const indicator = !!(dnd.dragging && dnd.hovering === bag)

      return html`
        <div
          ?data-indicator="${indicator}"
          @dragenter="${dropzone.dragenter}"
          @dragleave="${dropzone.dragleave}"
          @dragover="${dropzone.dragover}"
          @drop="${dropzone.drop}">
            bag ${bag.id}
        </div>
      `
    })
    ```

### 🪙 loot helpers
- **`loot.hasFiles(event)`** — return true if `DragEvent` contains any files (useful in `predicate`)
- **`loot.files(event)`** — returns an array of files in a drop's `DragEvent` (useful in `acceptDrop`)



<br/><br/>
<a id="dom"></a>

## 🪄 dom
> *the "it's not jquery!" multitool*  

```ts
import {dom} from "@e280/sly"
```

### 🪄 dom queries
- `require` an element
    ```ts
    dom(".demo")
      // HTMLElement (or throws)
    ```
    ```ts
    // alias
    dom.require(".demo")
      // HTMLElement (or throws)
    ```
- `maybe` get an element
    ```ts
    dom.maybe(".demo")
      // HTMLElement | undefined
    ```
- `all` matching elements in an array
    ```ts
    dom.all(".demo ul li")
      // HTMLElement[]
    ```

### 🪄 dom.in scope
- make a scope
    ```ts
    dom.in(".demo") // selector
      // Dom instance
    ```
    ```ts
    dom.in(demoElement) // element
      // Dom instance
    ```
- run queries in that scope
    ```ts
    dom.in(demoElement).require(".button")
    ```
    ```ts
    dom.in(demoElement).maybe(".button")
    ```
    ```ts
    dom.in(demoElement).all("ol li")
    ```

### 🪄 dom utilities
- `dom.register` web components
    ```ts
    dom.register({MyComponent, AnotherCoolComponent})
      // <my-component>
      // <another-cool-component>
    ```
    - `dom.register` automatically dashes the tag names (`MyComponent` becomes `<my-component>`)
- `dom.render` content into an element
    ```ts
    dom.render(element, html`<p>hello world</p>`)
    ```
    ```ts
    dom.in(".demo").render(html`<p>hello world</p>`)
    ```
- `dom.el` little element builder
    ```ts
    const div = dom.el("div", {"data-whatever": 123, "data-active": true})
      // <div data-whatever="123" data-active></div>
    ```
- `dom.elmer` make an element with a fluent chain
    ```ts
    const div = dom.elmer("div")
      .attr("data-whatever", 123)
      .attr("data-active")
      .children("hello world")
      .done()
        // HTMLElement
    ```
- `dom.mk` make an element with a lit template (returns the first)
    ```ts
    const div = dom.mk(html`
      <div data-whatever="123" data-active>
        hello world
      </div>
    `) // HTMLElement
    ```
- `dom.events` <a id="dom.events"></a> to attach event listeners
    ```ts
    const detach = dom.events(element, {
      keydown: (e: KeyboardEvent) => console.log("keydown", e.code),
      keyup: (e: KeyboardEvent) => console.log("keyup", e.code),
    })
    ```
    ```ts
    const detach = dom.in(".demo").events({
      keydown: (e: KeyboardEvent) => console.log("keydown", e.code),
      keyup: (e: KeyboardEvent) => console.log("keyup", e.code),
    })
    ```
    ```ts
    // unattach those event listeners when you're done
    detach()
    ```
- `dom.attrs` <a id="dom.attrs"></a> to setup a type-happy html attribute helper
    ```ts
    const attrs = dom.attrs(element).spec({
      name: String,
      count: Number,
      active: Boolean,
    })
    ```
    ```ts
    const attrs = dom.in(".demo").attrs.spec({
      name: String,
      count: Number,
      active: Boolean,
    })
    ```
    ```ts
    attrs.name // "chase"
    attrs.count // 123
    attrs.active // true
    ```
    ```ts
    attrs.name = "zenky"
    attrs.count = 124
    attrs.active = false // removes html attr
    ```
    ```ts
    attrs.name = undefined // removes the attr
    attrs.count = undefined // removes the attr
    ```
    or if you wanna be more loosey-goosey, skip the spec
    ```ts
    const a = dom.in(".demo").attrs
    a.strings.name = "pimsley"
    a.numbers.count = 125
    a.booleans.active = true
    ```



<br/><br/>
<a id="e280"></a>

## 🧑‍💻 sly is by e280
reward us with github stars  
build with us at https://e280.org/ but only if you're cool  

