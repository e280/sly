
<div align="center"><img alt="" width="256" src="./assets/favicon.png"/></div>

# 🦝 sly
> *mischievous shadow views*

[@e280](https://e280.org/)'s shiny, tasteful, incredible new [lit](https://lit.dev/)-based toolkit for frontend web developers.  
sly replaces its predecessor, [slate](https://github.com/benevolent-games/slate).  

- 🍋 **views** — hooks-based, shadow-dom'd, componentizable
- 🪄 **dom** — the "it's not jquery" multitool
- 🫛 **ops** — tools for async operations and loading spinners
- 🧪 **testing page** — https://sly.e280.org/



<br/><br/>

## 🦝 sly and friends

```sh
npm install @e280/sly lit
```

> [!NOTE]
> - 🔥 [lit](https://lit.dev/) for html rendering
> - ⛏️ [@e280/strata](https://github.com/e280/strata), for state management (signals, state trees)
> - 🏂 [@e280/stz](https://github.com/e280/stz) is our ts standard library
> - 🐢 [scute](https://github.com/e280/scute) is our buildy-bundly-buddy



<br/><br/>

## 🦝🍋 sly views
> *views are the crown jewel of sly.. shadow-dom'd.. hooks-based.. "ergonomics"..*

```ts
view(use => () => html`<p>hello world</p>`)
```

- views are not [web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components), but they do have [shadow roots](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM) and support [slots](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots)
- any view can be registered as a web component, perfect for entrypoints or sharing widgets with html authors
- views are typescript-native and comfy for webdevs building apps
- views automatically rerender whenever any [strata-compatible](https://github.com/e280/strata) state changes

### 🍋 view example
- **import stuff**
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
    dom.register({MyCounter: CounterView.component(1)})
      // <my-counter></my-counter>
    ```

### 🍋 view declaration settings
- special settings for views at declaration-time
    ```ts
    export const CoolView = view
      .settings({mode: "open", delegatesFocus: true})
      .declare(use => (greeting: string) => {
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

### 🍋 view web components
- **build a component directly**
    ```ts
    const MyComponent = view.component(use => html`<p>hello world</p>`)
    ```
    - notice that direct components don't take props (do `use.attrs` instead)
- **convert any view into a web component**
    ```ts
    const MyCounter = CounterView.component(1)
    ```
    - to convert a view to a component, you provide props
    - note that the component instance has a render method like `element.render(2)` which can take new props at runtime
- **register web components to the dom**
    ```ts
    dom.register({MyComponent, MyCounter})
      // <my-component></my-component>
      // <my-counter></my-counter>
    ```
    - `dom.register` automatically dashes the tag names (`MyComponent` becomes `<my-component>`)

### 🍋 view "use" hooks reference
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
    - `derive` signals
        ```ts
        const $product = use.derive(() => $count() * $whatever())
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
    ```ts
    attrs.name = "zenky"
    attrs.count = 124
    attrs.active = false // removes html attr
    ```
    ```ts
    attrs.name = undefined // removes the attr
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

### 🍋 view "use" recipes
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

## 🦝🪄 sly dom
> *the "it's not jquery!" multitool*

```ts
import {dom} from "@e280/sly"
```

### 🪄 dom queries
- require an element
    ```ts
    dom(".demo")
      // HTMLElement (or throws)
    ```
- maybe get an element
    ```ts
    dom.maybe(".demo")
      // HTMLElement | undefined
    ```
- select all elements
    ```ts
    dom.all(".demo ul li")
      // HTMLElement[]
    ```
- within a specific container
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
- `render` content into an element
    ```ts
    dom(element).render(html`<p>hello world</p>`)
    ```
    ```ts
    dom(".demo").render(html`<p>hello world</p>`)
    ```
    ```ts
    dom.render(element, html`<p>hello world</p>`)
    ```
- `in` select within an element
    ```ts
    dom(element)
      .in(".demo")
      .render(html`<p>hello world</p>`)
    ```



<br/><br/>

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

## 🦝🧑‍💻 sly is by e280
reward us with github stars  
build with us at https://e280.org/ but only if you're cool  

