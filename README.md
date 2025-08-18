
<div align="center"><img alt="" width="256" src="./assets/favicon.png"/></div>

# 🦝 sly — mischievous shadow views
> testing page at https://sly.e280.org/

- 🍋 web app view library with taste
- 🥷 leverage shadow-dom and slots
- 🤯 register any view as a web component
- 💲 handy little dom multitool
- 🫛 ops for fancy loading spinners
- 😩 took many years of iteration and suffering
- 🌅 sly is the successor that replaces [@benev/slate](https://github.com/benevolent-games/slate)
- 🧑‍💻 project by [@e280](https://e280.org/)

<br/>

## 🦝 INSTALL SLY AND PALS

```sh
npm install @e280/sly lit @e280/strata @e280/stz
```

> [!NOTE]
> - 🔥 [lit](https://lit.dev/) for html rendering
> - ⛏️ [@e280/strata](https://github.com/e280/strata) for state management (signals, state trees)
> - 🏂 *(optional)* [@e280/stz](https://github.com/e280/stz) stz is our ts standard library
> - 🐢 *(optional)* [scute](https://github.com/e280/scute) is our buildy-bundly-buddy

<br/>

## 🦝 SLY VIEWS
views are the crown jewel of sly. shadow-dom'd. hooks-based. fancy ergonomics.

```ts
view(use => () => "hello world")
```

views are not web components.

where web components are html-native, views are typescript-native — with views, there's no dom registration or string tag names, you just import them and the types work.

web components are best for giving html authors access to your cool widgets.. and that's cool, because any sly view can be registered as a web component.

views automatically rerender whenever any state stuff from [@e280/strata](https://github.com/e280/strata) changes.

🥷 views have a [shadow root](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM), and support [slots](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots).  
views have the good parts of web components, but they aren't cumbersome.

### 🍋 view example
- **import some stuff**
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
      const increment = () => { count.value++ }

      return html`
        <p>count ${count()}</p>
        <button @click="${increment}">+</button>
      `
    })
    ```
    - each view renders into a `<sly-view view="counter">` host (where "counter" is the `use.name` you provided)
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
      // <my-counter></my-counter>
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
        .children(html`<em>spongebob</em>`)
        .props("hello")}
    `)
    ```
    - `attr` — set html attributes on the `<sly-view>` host element
    - `children` — nested content in the host element, can be [slotted](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots)
    - `props` — finally inject the view by providing its props

### 🍋 web components
- **build a component directly**
    ```ts
    const MyComponent = view.component(use => html`hello world`)
    ```
    - notice that components don't take props
- **convert any view into a web component**
    ```ts
    const MyCounter = CounterView.component(1)
    ```
    - to convert a view to a component, you provide props
    - note that the component instance has a render method like `element.render(2)` which can take new props
- **register web components to the dom**
    ```ts
    $.register({MyComponent, MyCounter})
      // <my-component></my-component>
      // <my-counter></my-counter>
    ```
    - `$.register` automatically dashes the tag names (`MyComponent` becomes `<my-component>`)

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
- **use.signal** — create a [strata signal](https://github.com/e280/strata)
    ```ts
    const count = use.signal(1)

    // read the signal
    count() // 1

    // write the signal
    count(2)
    ```
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
    const seconds = use.signal(0)

    use.mount(() => repeat(async() => {
      await nap(1000)
      seconds.value++
    }))
    ```
- wake + rendered, to do something after each mount's first render
    ```ts
    use.wake(() => use.rendered.then(() => {
      console.log("after first render")
    }))
    ```

<br/>

## 🦝 SLY `$` DOM MULTITOOL

### 💲 follow the money
- import the dollarsign
    ```ts
    import {$} from "@e280/sly"
    ```

### 💲 dom queries
- require an element
    ```ts
    $(".demo")
      // HTMLElement (or throws error)
    ```
- request an element
    ```ts
    $.maybe(".demo")
      // HTMLElement | undefined
    ```
- query all elements
    ```ts
    for (const item of $.all("ul li"))
      console.log(item)
    ```
- specify what element to query under
    ```ts
    $("li", listElement)
      // HTMLElement
    ```

### 💲 dom utilities
- render content into an element
    ```ts
    $.render(element, html`hello world`)
    ```
- register web components
    ```ts
    $.register({MyComponent, AnotherCoolComponent})
      // <my-component>
      // <another-cool-component>
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
    const op = Op.fn(async() => {
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

