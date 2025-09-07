
<div align="center"><img alt="" width="256" src="./assets/favicon.png"/></div>

# 🦝 sly
> *mischievous shadow views*

[@e280](https://e280.org/)'s shiny new [lit](https://lit.dev/)-based frontend lib for webdevs. *(sly replaces its predecessor, [slate](https://github.com/benevolent-games/slate))*

- 🍋 [**views**](#views) — hooks-based, shadow-dom'd, componentizable
- 🪵 [**base element**](#base-element) — for a more classical experience
- 🪄 [**dom**](#dom) — the "it's not jquery" multitool
- 🫛 [**ops**](#ops) — tools for async operations and loading spinners
- 🪙 [**loot**](#loot) — drag-and-drop facilities
- 🧪 testing page — https://sly.e280.org/



<br/><br/>

## 🦝 sly and friends

```sh
npm install @e280/sly lit @e280/strata @e280/stz
```

> [!NOTE]
> - 🔥 [lit](https://lit.dev/), for html rendering
> - ⛏️ [@e280/strata](https://github.com/e280/strata), for state management (signals, state trees)
> - 🏂 [@e280/stz](https://github.com/e280/stz), our ts standard library
> - 🐢 [@e280/scute](https://github.com/e280/scute), our buildy-bundly-buddy



<br/><br/>
<a id="views"></a>

## 🦝🍋 sly views and components
> *views are the crown jewel of sly.. shadow-dom'd.. hooks-based.. "ergonomics"..*

```ts
view(use => () => html`<p>hello world</p>`)
```

- any view can be converted into a web component
- views are not [web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components), but they do have [shadow roots](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM) and support [slots](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots)
- views are typescript-native and comfy for webdevs building apps
- views automatically rerender whenever any [strata-compatible](https://github.com/e280/strata) state changes

### 🍋 view example
```ts
import {view, dom} from "@e280/sly"
import {html, css} from "lit"
```
- **declare a view**
    ```ts
    export const CounterView = view(use => (start: number) => {
      use.name("counter")
      use.styles(css`p {color: green}`)

      const $count = use.signal(start)
      const increment = () => $count.value++

      return html`
        <p>count ${$count.value}</p>
        <button @click="${increment}">+</button>
      `
    })
    ```
    - each view renders into a `<sly-view view="counter">` host (where "counter" is the `use.name` you provided)
- **inject a view into the dom**
    ```ts
    dom.in(".app").render(html`
      <h1>cool counter demo</h1>
      ${CounterView(1)}
    `)
    ```
- 🤯 **register a view as a web component**
    ```ts
    dom.register({
      MyCounter: CounterView
        .component()
        .props(component => [dom.attrs(component).number.start ?? 0]),
    })
    ```
    ```html
    <my-counter start="1"></my-counter>
    ```

### 🍋 view declaration settings
- special settings for views at declaration-time
    ```ts
    export const CoolView = view
      .settings({mode: "open", delegatesFocus: true})
      .render(use => (greeting: string) => {
        return html`😎 ${greeting} <slot></slot>`
      })
    ```
    - all [attachShadow params](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#parameters) (like `mode` and `delegatesFocus`) are valid `settings`
    - note the `<slot></slot>` we'll use in the next example lol

### 🍋 view injection options
- options for views at the template injection site
    ```ts
    dom.in(".app").render(html`
      <h2>cool example</h2>
      ${CoolView.props("hello")
        .attr("class", "hero")
        .children(html`<em>spongebob</em>`)
        .render()}
    `)
    ```
    - `props` — provide props and start a view chain
    - `attr` — set html attributes on the `<sly-view>` host element
    - `children` — nested content in the host element, can be [slotted](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots)
    - `render` — end the view chain and render the lit directive

### 🍋 view/component universality
- **start with a view,**
    ```ts
    export const GreeterView = view(use => (name: string) => {
      return html`<p>hello ${name}</p>`
    })

    // view usage:
    //   GreeterView("pimsley")
    ```
    then you can convert it to a component
    ```ts
    export class GreeterComponent extends (GreeterView
      .component()
      .props(component => [component.getAttribute("name") ?? "unknown"])
    ) {}

    // html usage:
    //   <greeter-component name="pimsley"></greeter-component>
    ```
- **start with a component,**
    ```ts
    export class GreeterComponent extends (view
      .component()
      .props(component => [component.getAttribute("name") ?? "unknown"])
      .render(use => (name: string) => {
        return html`<p>hello ${name}</p>`
      })
    ) {}

    // html usage:
    //   <greeter-component name="pimsley"></greeter-component>
    ```
    then you can already use it as a view
    ```ts
    // view usage:
    //   GreeterComponent.view("pimsley")
    ```
- **understanding `.component(init)` and `.props(fn)`**
    - `.props` takes a fn that is called every render, which returns the props given to the view
        ```ts
        .component()
        .props(() => ["pimsley"])
        ```
        the props fn receives the component instance, so you can query html attributes
        ```ts
        .component()
        .props(component => [component.getAttribute("name") ?? "unknown"])
        ```
    - `.component` takes a mixin type added to the component type, so your `.props` can accept instance properties
        ```ts
        .component<{name?: string}>()
        .props(component => [component.name ?? "unknown"])
        ```
    - `.component` also takes an init fn, so you can do some setup, like use signals for reactivity
        ```ts
        .component<{$name: Signal<string>}>(component => {
          component.$name = signal("pimsley")
        })
        .props(component => [component.$name])
        ```
- **register web components to the dom**
    ```ts
    dom.register({GreeterComponent})
    ```

### 🍋 "use" hooks reference
- 👮 **follow the hooks rules**  
    > just like [react hooks](https://react.dev/warnings/invalid-hook-call-warning), the execution order of sly's `use` hooks actually matters..  
    > you must not call these hooks under `if` conditionals, or `for` loops, or in callbacks, or after a conditional `return` statement, or anything like that.. *otherwise, heed my warning: weird bad stuff will happen..*
- **use.name** — set the "view" attr value, eg `<sly-view view="squarepants">`
    ```ts
    use.name("squarepants")
    ```
- **use.styles** — attach stylesheets into the view's shadow dom
    ```ts
    use.styles(css1, css2, css3)
    ```
    *(alias `use.css`)*
- **use.signal** — create a [strata signal](https://github.com/e280/strata)
    ```ts
    const $count = use.signal(1)

    // read the signal
    $count()

    // write the signal
    $count(2)
    ```
    - `derived` signals
        ```ts
        const $product = use.derived(() => $count() * $whatever())
        ```
    - `lazy` signals
        ```ts
        const $product = use.lazy(() => $count() * $whatever())
        ```
    - go read the [strata readme](https://github.com/e280/strata) about this stuff
- **use.once** — run fn at initialization, and return a value
    ```ts
    const whatever = use.once(() => {
      console.log("happens only once")
      return 123
    })

    whatever // 123
    ```
- **use.mount** — setup mount/unmount lifecycle
    ```ts
    use.mount(() => {
      console.log("view mounted")

      return () => {
        console.log("view unmounted")
      }
    })
    ```
- **use.wake** — run fn each time mounted, and return value
    ```ts
    const whatever = use.wake(() => {
      console.log("view mounted")
      return 123
    })

    whatever // 123
    ```
- **use.life** — mount/unmount lifecycle, but also return a value
    ```ts
    const v = use.life(() => {
      console.log("mounted")
      const value = 123
      return [value, () => console.log("unmounted")]
    })

    v // 123
    ```
- **use.attrs** — ergonomic typed html attribute access  
    *(see [dom.attrs](#dom.attrs) for more details)*
    ```ts
    const attrs = use.attrs({
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
- **use.render** — rerender the view (debounced)
    ```ts
    use.render()
    ```
- **use.renderNow** — rerender the view instantly (not debounced)
    ```ts
    use.renderNow()
    ```
- **use.rendered** — promise that resolves *after* the next render
    ```ts
    use.rendered.then(() => {
      const slot = use.shadow.querySelector("slot")
      console.log(slot)
    })
    ```
- **use.op** — start with an op based on an async fn
    ```ts
    const op = use.op(async() => {
      await nap(5000)
      return 123
    })
    ```
- **use.op.promise** — start with an op based on a promise
    ```ts
    const op = use.op.promise(doAsyncWork())
    ```

### 🍋 "use" recipes
- make a ticker — mount, repeat, and nap
    ```ts
    import {repeat, nap} from "@e280/stz"
    ```
    ```ts
    const $seconds = use.signal(0)

    use.mount(() => repeat(async() => {
      await nap(1000)
      $seconds.value++
    }))
    ```
- wake + rendered, to do something after each mount's first render
    ```ts
    use.wake(() => use.rendered.then(() => {
      console.log("after first render")
    }))
    ```



<br/><br/>
<a id="base-element"></a>

## 🦝🪵 sly base element
> *the classic experience*

```ts
import {BaseElement, Use, dom} from "@e280/sly"
import {html, css} from "lit"
```

`BaseElement` is a class-based approach to create a custom element web component.

it lets you expose js properties on the element instance, which helps you setup a better developer experience for people interacting with your element through the dom.

base element enjoys the same `use` hooks as views.

### 🪵 base element setup
- **declare your element class**
    ```ts
    export class MyElement extends BaseElement {
      static styles = css`span{color:orange}`

      // custom property
      start = 10

      // custom attributes
      attrs = dom.attrs(this, {
        multiply: Number,
      })

      // custom methods
      hello() {
        return "world"
      }

      render(use: Use) {
        const $count = use.signal(1)
        const increment = () => $count.value++

        const {start} = this
        const {multiply = 1} = this.attrs
        const result = start + (multiply * $count())

        return html`
          <span>${result}</span>
          <button @click="${increment}">+</button>
        `
      }
    }
    ```
- **register your element to the dom**
    ```ts
    dom.register({MyElement})
    ```

### 🪵 base element usage
- **place the element in your html body**
    ```html
    <body>
      <my-element></my-element>
    </body>
    ```
- **now you can interact with it**
    ```ts
    const myElement = dom<MyElement>("my-element")

    // js property
    myElement.start = 100

    // html attributes
    myElement.attrs.multiply = 2

    // methods
    myElement.hello()
      // "world"
    ```



<br/><br/>
<a id="dom"></a>

## 🦝🪄 sly dom
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
- `maybe` get an element
    ```ts
    dom.maybe(".demo")
      // HTMLElement | undefined
    ```
- `select` all elements
    ```ts
    dom.all(".demo ul li")
      // HTMLElement[]
    ```
- `in` the scope of an element
    ```ts
    dom(element).require("li")
      // HTMLElement (or throws)
    ```
    ```ts
    dom(element).maybe("li")
      // HTMLElement | undefined
    ```
    ```ts
    dom(element).all("li")
      // HTMLElement[]
    ```

### 🪄 dom utilities
- `register` web components
    ```ts
    dom.register({MyComponent, AnotherCoolComponent})
      // <my-component>
      // <another-cool-component>
    ```
    - `dom.register` automatically dashes the tag names (`MyComponent` becomes `<my-component>`)
- `render` content into an element
    ```ts
    dom(element).render(html`<p>hello world</p>`)
    ```
    ```ts
    dom.in(".demo").render(html`<p>hello world</p>`)
    ```
    ```ts
    dom.render(element, html`<p>hello world</p>`)
    ```
- `attrs` <a id="dom.attrs"></a> to setup a type-happy html attribute helper
    ```ts
    const attrs = dom.attrs(element, {
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



<br/><br/>
<a id="ops"></a>

## 🦝🫛 sly ops
> *tools for async operations and loading spinners*

```ts
import {nap} from "@e280/stz"
import {Pod, podium, Op, makeLoader, anims} from "@e280/sly"
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

### 🫛 loaders: animated loading spinners
- create a `loader` using `makeLoader`
    ```ts
    const loader = makeLoader(anims.dots)
    ```
    - see all the anims available on the testing page https://sly.e280.org/
    - ngl, i made too many.. *i was having fun, okay?*
- use the loader to render your op
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

## 🦝🪙 loot
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
      view(() => () => html`
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
      const attrs = dom.attrs(document.body, {
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
    view(use => () => {
      const money = use.once((): Money => ({value: 280}))
      const dragzone = use.once(() => dnd.dragzone(() => money))

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
    view(use => () => {
      const bag = use.once((): Bag => ({id: 1}))
      const dropzone = use.once(() => dnd.dropzone(() => bag))
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
<a id="e280"></a>

## 🦝🧑‍💻 sly is by e280
reward us with github stars  
build with us at https://e280.org/ but only if you're cool  



<br/><br/>

