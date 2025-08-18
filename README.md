
<div align="center"><img alt="" width="256" src="./assets/favicon.png"/></div>

# 🦝 sly — mischievous shadow views
> testing page at https://sly.e280.org/

- 🪒 lean view framework for [lit](https://lit.dev/) web devs
- 🍋 views are the building blocks of web apps
- 🤯 register any view as a web component
- 🖋️ `$` dom multitool
- 🫛 ops for fancy loading spinners
- 🧑‍💻 project by [@e280](https://e280.org/)

<br/>

## 🦝 INSTALL SLY AND PALS

```sh
npm install @e280/sly lit @e280/stz @e280/strata
```

> [!NOTE]
> - 🌅 sly is the successor to [@benev/slate](https://github.com/benevolent-games/slate)
> - 🐢 if you need a buildy-bundly-buddy, try [scute](https://github.com/e280/scute)
> - 🔥 sly integrates with and uses rendering from [lit](https://lit.dev/)
> - 🏂 sly is commonly used with stz standard library [@e280/stz](https://github.com/e280/stz)
> - ⛏️ integrates signals and state trees from [@e280/strata](https://github.com/e280/strata)

<br/>

## 🦝 SLY VIEWS
views are the crown jewel of sly. shadow-dom'd. hooks-based. fancy ergonomics.

```ts
view(use => () => "hello world")
```

views are not components.. they're leaner than web components.. no dom registration, no string tag names.. just import 'em, and the types work.. web components are fine, but they're for providing html authors with entrypoints to your cool widgets.. whereas views are the true building blocks for frontend app devs..

you can register any view to the dom as a web component.

views are wired to automatically rerender whenever they're using any state stuff from [@e280/strata](https://github.com/e280/strata).

### 🍋 practical example
- views are hooks-based functional components with a [shadow root](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)
- **import some stuff you'll need**
    ```ts
    import {$, view} from "@e280/sly"
    import {html, css} from "lit"
    ```
- **declaring a view**
    ```ts
    export const CounterView = view(use => (start: number) => {
      use.name("counter")
      use.styles(css`p {color: green}`)
      const count = use.signal(start)

      return html`
        <p>count ${count()}</p>
        <button @click="${() => { count.value++ }}">+</button>
      `
    })
    ```
    - each view renders into a `<sly-view>` host, with the provided `name` set as its view attribute, eg `<sly-view view="counter">`
- **inject a view into the dom**
    ```ts
    $.render($(".app"), html`
      <h1>my cool counter demo</h1>

      ${CounterView(1)}
    `)
    ```
- 🤯 **register view as a web component**
    ```ts
    $.register({MyCounter: CounterView.component(1)})
      // <my-counter></my-counter> is available in html
    ```

### 🍋 view declaration settings
- special settings for views at declaration-time
    ```ts
    export const CoolView = view
      .settings({mode: "open", delegatesFocus: true})
      .view(use => (greeting: string) => {

      return html`😎 ${greeting} <slot></slot>`
    })
    ```
    - these `settings` like `mode` and `delegatesFocus` are [attachShadow params](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#parameters)
    - note the `<slot></slot>` we'll use in the next example lol

### 🍋 view injection options
- options for views at the template injection site
    ```ts
    $.render($(".app"), html`
      <h2>super cool example</h2>
      ${CoolView
        .attr("class", "hero")
        .children(html`<em>world</em>`)
        .props("hello")}
    `)
    ```
    - `attr` — set html attributes on the `<sly-view>` host element
    - `children` — nested content in the host element, can be [slotted](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots)
    - `props` — finally inject the view by providing its props

### 🍋 view `use` reference
- **use.name** — set the "view" attr value, eg `<sly-view view="squarepants">`
    ```ts
    use.name("squarepants")
    ```
- **use.styles** — attach stylesheets into the view's shadow dom
    ```ts
    use.styles(css1, css2, css3)
    ```
- **use.signal** — create a [strata signal](https://github.com/e280/strata)
    ```ts
    const count = use.signal(1)

    // read the signal
    count() //-> 1

    // write the signal
    count(2)
    ```
- **use.once** — run fn at initialization
    ```ts
    const whatever = use.once(() => {
      console.log("happens only once")
      return 123
    })

    whatever //-> 123
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
- **use.life** — mount/unmount lifecycle, but also return a value
    ```ts
    const v = use.life(() => {
      console.log("mounted")
      const value = 123
      return [value, () => console.log("unmounted")]
    })

    v //-> 123
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
- **use.render** — force a hard render (not debounced)
    ```ts
    use.render()
    ```
- **use.rendered** — promise that resolves *after* the next render
    ```ts
    use.rendered.then(() => {
      const slot = use.shadow.querySelector("slot")
      console.log(slot)
    })
    ```
- **use.op.fn** — start with an op based on an async fn
    ```ts
    const op = use.op.fn(async() => {
      await nap(5000)
      return 123
    })
    ```
- **use.op.promise** — start with an op based on a promise
    ```ts
    const op = use.op.promise(doAsyncWork())
    ```

### 🍋 web components
- convert any view into a proper web component
    ```ts
    CounterView.component(1)
    ```
- or build a component directly
    ```ts
    const MyComponent = view.component(use => html`hello world`)
    ```
- register web components to the dom like this
    ```ts
    $.register({
      MyCounter: CounterView.component(1),
      MyComponent,
    })

    // <my-counter></my-counter>
    // <my-component></my-component>
    ```
    - `$.register` automatically dashes the tag names (`MyComponent` becomes `<my-component>`)

### 🍋 neat tricks to impress the ladies
- make a ticker — mount, repeat, and nap
    ```ts
    import {repeat, nap} from "@e280/stz"
    ```
    ```ts
    const seconds = use.signal(0)

    use.mount(() => repeat(async() => {
      await nap(1000)
      seconds.value++
    }))
    ```
- once+rendered to do an action after the first render
    ```ts
    use.once(() => use.rendered.then(() => {
      console.log("after first render")
    }))
    ```

<br/>

## 🦝 SLY `$` DOM MULTITOOL

### 🖋️ the pen is mightier than the sword
- import the `$` and it has a bunch of goodies
    ```ts
    import {$} from "@e280/sly"
    ```

### 🖋️ query the dom
- select an element
    ```ts
    $(".demo")
      // HTMLElement (or throws error)
    ```
- query an element
    ```ts
    $.maybe(".demo")
      // HTMLElement | undefined
    ```
- query all elements
    ```ts
    $.all("ul li")
      // HTMLElement[]
    ```
- specify what element to query under
    ```ts
    $("li", listElement)
      // HTMLElement
    ```

### 🖋️ dom utilities
- register web components
    ```ts
    $.register({MyComponent, AnotherCoolComponent})
      // <my-component>
      // <another-cool-component>
    ```
- render content into an element
    ```ts
    $.render(element, html`hello world`)
    ```

<br/>

## 🦝 SLY OPS, PODS, AND LOADERS
async operations and displaying loading spinners.

```ts
import {nap} from "@e280/stz"
import {Pod, podium, Op, makeLoader, anims} from "@e280/sly"
```

### 🫛 pods: loading/ready/error data
- a pod represents an async operation
- pods are simple json-serializable data
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
    const op = new Op<number>(["loading"])
    ```
- 🔥 create an op that calls and tracks an async fn
    ```ts
    const op = Op.fn(async() => {
      await nap(4000)
      return 123
    })
    ```
- await for the next ready value (or thrown error)
    ```ts
    await op
      // 123
    ```
- get pod info
    ```ts
    op.status
      // "loading"
    ```
    ```ts
    op.pod
      // ["loading"]
    ```
    ```ts
    op.value
      // undefined (or value if ready)
    ```
    ```ts
    op.isLoading // true
    op.isReady // false
    op.isError // false
    ```
- create an op with starting status
    ```ts
    Op.loading<number>()
    Op.ready(123)
    Op.error<number>(new Error())
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
    const loader = makeLoader(anims.bar2)
    ```
    - see all the anims available on the testing page https://sly.e280.org/
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

<br/>

## 🧑‍💻 SLY BY E280
reward us with github stars  
build with us at https://e280.org/ but only if you're cool  

