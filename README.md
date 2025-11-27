
<div align="center"><img alt="" width="256" src="./assets/favicon.png"/></div>

# 🦝 sly
> *mischievous shadow views*

[@e280](https://e280.org/)'s new [lit](https://lit.dev/)-based frontend webdev library.

- 🍋 [**#views**](#views) — shadow-dom'd, hooks-based, componentizable
- 🪵 [**#base-element**](#base-element) — for a more classical experience
- 🪄 [**#dom**](#dom) — the "it's not jquery" multitool
- 🫛 [**#ops**](#ops) — reactive tooling for async operations
- ⏳ [**#loaders**](#loaders) — animated loading spinners for rendering ops
- 💅 [**#spa**](#spa) — hash routing for your spa-day
- 🪙 [**#loot**](#loot) — drag-and-drop facilities
- 🧪 https://sly.e280.org/ — our testing page
- **✨[shiny](https://shiny.e280.org/)✨** — our wip component library



<br/><br/>

## 🦝 sly and friends
> `@e280/sly`  

```sh
npm install @e280/sly lit @e280/strata @e280/stz
```

> [!NOTE]
> - 🔥 [lit](https://lit.dev/), for html rendering
> - ⛏️ [@e280/strata](https://github.com/e280/strata), for state management (signals, state trees)
> - 🏂 [@e280/stz](https://github.com/e280/stz), our ts standard library
> - 🐢 [@e280/scute](https://github.com/e280/scute), our buildy-bundly-buddy

> [!TIP]
> you can import everything in sly from `@e280/sly`,  
> or from specific subpackages like `@e280/sly/view`, `@e280/sly/dom`, etc...



<br/><br/>
<a id="views"></a>

## 🍋🦝 sly views
> `@e280/sly/view`  
> *the crown jewel of sly*  

```ts
view(use => () => html`<p>hello world</p>`)
```

- 🪶 **no compile step** — just god's honest javascript, via [lit](https://lit.dev/)-html tagged-template-literals
- 🥷 **shadow dom'd** — each view gets its own cozy [shadow](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM) bubble, and supports [slots](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots)
- 🪝 **hooks-based** — declarative rendering with the [`use`](#use) family of ergonomic hooks
- ⚡ **reactive** — they auto-rerender whenever any [strata](https://github.com/e280/strata)-compatible state changes
- 🧐 **not components, per se** — they're comfy typescript-native ui building blocks [(technically, lit directives)](https://lit.dev/docs/templates/custom-directives/)
- 🧩 **componentizable** — any view can be magically converted into a proper [web component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)

### 🍋 view example
```ts
import {view, dom, BaseElement} from "@e280/sly"
import {html, css} from "lit"
```
- **declare view**
    ```ts
    export const CounterView = view(use => (start: number) => {
      use.styles(css`p {color: green}`)

      const $count = use.signal(start)
      const increment = () => $count.value++

      return html`
        <button @click="${increment}">
          ${$count.value}
        </button>
      `
    })
    ```
    - `$count` is a [strata signal](https://github.com/e280/strata#readme) *(we like those)*
- **inject view into dom**
    ```ts
    dom.in(".app").render(html`
      <h1>cool counter demo</h1>
      ${CounterView(1)}
    `)
    ```
- 🤯 **register view as web component**
    ```ts
    dom.register({
      MyCounter: CounterView
        .component()
        .props(() => [1]),
    })
    ```
    ```html
    <my-counter></my-counter>
    ```

### 🍋 view settings
- optional settings for views you should know about
    ```ts
    export const CoolView = view
      .settings({mode: "open", delegatesFocus: true})
      .render(use => (greeting: string) => html`😎 ${greeting} <slot></slot>`)
    ```
    - all [attachShadow params](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#parameters) (like `mode` and `delegatesFocus`) are valid `settings`
    - note the `<slot></slot>` we'll use in the next example lol

### 🍋 view chains
- views have this sick chaining syntax for supplying more stuff at the template injection site
    ```ts
    dom.in(".app").render(html`
      <h2>cool example</h2>
      ${CoolView
        .props("hello")
        .attr("class", "hero")
        .children(html`<em>spongebob</em>`)
        .render()}
    `)
    ```
    - `props` — provide props and start a view chain
    - `attr` — set html attributes on the `<sly-view>` host element
    - `children` — add nested [slottable](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots) content
    - `render` — end the view chain and render the lit directive

### 🍋 view/component universality
- **you can start with a view,**
    ```ts
    export const GreeterView = view(use => (name: string) => {
      return html`<p>hello ${name}</p>`
    })
    ```
    - view usage
        ```ts
        GreeterView("pimsley")
        ```
    **then you can convert it to a component.**
    ```ts
    export class GreeterComponent extends (
      GreeterView
        .component()
        .props(component => [component.getAttribute("name") ?? "unknown"])
    ) {}
    ```
    - html usage
        ```html
        <greeter-component name="pimsley"></greeter-component>
        ```
- **you can start with a component,**
    ```ts
    export class GreeterComponent extends (
      view(use => (name: string) => {
        return html`<p>hello ${name}</p>`
      })
      .component()
      .props(component => [component.getAttribute("name") ?? "unknown"])
    ) {}
    ```
    - html usage
        ```html
        <greeter-component name="pimsley"></greeter-component>
        ```
    **and it already has `.view` ready for you.**
    - view usage
        ```ts
        GreeterComponent.view("pimsley")
        ```
- **understanding `.component(BaseElement)` and `.props(fn)`**
    - `.props` takes a fn that is called every render, which returns the props given to the view
        ```ts
        .props(() => ["pimsley"])
        ```
        the props fn receives the component instance, so you can query html attributes or instance properties
        ```ts
        .props(component => [component.getAttribute("name") ?? "unknown"])
        ```
    - `.component` accepts a subclass of `BaseElement`, so you can define your own properties and methods for your component class
        ```ts
        const GreeterComponent = GreeterView

          // declare your own custom class
          .component(class extends BaseElement {
            $name = signal("jim raynor")
            updateName(name: string) {
              this.$name.value = name
            }
          })

          // props gets the right types on 'component'
          .props(component => [component.$name.value])
        ```
    - `.component` provides the devs interacting with your component, with noice typings
        ```ts
        dom<GreeterComponent>("greeter-component").updateName("mortimer")
        ```
    - typescript class wizardry
        - ❌ smol-brain approach exports class value, but NOT the typings
            ```ts
            export const GreeterComponent = (...)
            ```
        - ✅ giga-brain approach exports class value AND the typings
            ```ts
            export class GreeterComponent extends (...) {}
            ```
- **register web components to the dom**
    ```ts
    dom.register({GreeterComponent})
    ```
- **oh and don't miss out on the insta-component shorthand**
    ```ts
    dom.register({
      QuickComponent: view.component(use => html`⚡ incredi`),
    })
    ```

<a id="use"></a>

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
- **use.events** — attach event listeners to the element (auto-cleaned up)  
    ```ts
    use.events({
      keydown: (e: KeyboardEvent) => console.log("keydown", e.code),
      keyup: (e: KeyboardEvent) => console.log("keyup", e.code),
    })
    ```
- **use.states** — [internal states](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals/states) helper  
    ```ts
    const states = use.states()
    states.assign("active", "cool")
    ```
    ```css
    [view="my-view"]::state(active) { color: yellow; }
    [view="my-view"]::state(cool) { outline: 1px solid cyan; }
    ```
- **use.attrs** — ergonomic typed html attribute access  
    - `use.attrs` is similar to [#dom.attrs](#dom.attrs)
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
    - use.attrs.{strings/numbers/booleans}
        ```ts
        use.attrs.strings.name // "chase"
        use.attrs.numbers.count // 123
        use.attrs.booleans.active // true
        ```
    - use.attrs.on
        ```ts
        use.attrs.on(() => console.log("an attribute changed"))
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
- make a ticker — mount, cycle, and nap
    ```ts
    import {cycle, nap} from "@e280/stz"
    ```
    ```ts
    const $seconds = use.signal(0)

    use.mount(() => cycle(async() => {
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

## 🪵🦝 sly base element
> `@e280/sly/base`  
> *the classic experience*  

```ts
import {BaseElement, Use, dom} from "@e280/sly"
import {html, css} from "lit"
```

`BaseElement` is more of an old-timey class-based "boomer" approach to making web components, but with a millennial twist — its `render` method gives you the same `use` hooks that views enjoy.

👮 a *BaseElement* is not a *View*, and cannot be converted into a *View*.

### 🪵 let's clarify some sly terminology
- "Element"
    - an html element; any subclass of the browser's HTMLElement
    - all genuine ["web components"](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) are elements
- "BaseElement"
    - sly's own subclass of the browser-native HTMLElement
    - is a true element and web component (can be registered to the dom)
- "View"
    - sly's own magic concept that uses a lit-directive to render stuff
    - NOT an element or web component (can NOT be registered to the dom)
    - NOT related to BaseElement
    - can be converted into a Component via `view.component().props(() => [])`
- "Component"
    - a sly view that has been converted into an element
    - is a true element and web component (can be registered to the dom)
    - actually a subclass of BaseElement
    - actually contains the view on `Component.view`

### 🪵 base element setup
- **declare your element class**
    ```ts
    export class MyElement extends BaseElement {
      static styles = css`span{color:orange}`

      // custom property
      $start = signal(10)

      // custom attributes
      attrs = dom.attrs(this).spec({
        multiply: Number,
      })

      // custom methods
      hello() {
        return "world"
      }

      render(use: Use) {
        const $count = use.signal(1)
        const increment = () => $count.value++

        const {$start} = this
        const {multiply = 1} = this.attrs
        const result = $start() + (multiply * $count())

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
    myElement.$start(100)

    // html attributes
    myElement.attrs.multiply = 2

    // methods
    myElement.hello()
      // "world"
    ```



<br/><br/>
<a id="dom"></a>

## 🪄🦝 sly dom
> `@e280/sly/dom`  
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
<a id="ops"></a>

## 🫛🦝 sly ops
> `@e280/sly/ops`  
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

## ⏳🦝 sly loaders
> `@e280/sly/loaders`  
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
<a id="spa"></a>

## 💅🦝 sly spa
> `@e280/sly/spa`  
> *hash router for single-page-apps*  

```ts
import {spa, html} from "@e280/sly"
```

### 💅 spa.Router basics
- **make a spa router**
    ```ts
    const router = new spa.Router({
      routes: {
        home: spa.route("#/", async() => html`home`),
        settings: spa.route("#/settings", async() => html`settings`),
        user: spa.route("#/user/{userId}", async({userId}) => html`user ${userId}`),
      },
    })
    ```
    - all route strings must start with `#/`
    - use braces like `{userId}` to accept string params
    - home-equivalent hashes like `""` and `"#"` are normalized to `"#/"`
    - the router has an effect on the appearance of the url in the browser address bar -- the home `#/` is removed, aesthetically, eg, `e280.org/#/` is rewritten to `e280.org` using *history.replaceState*
    - you can provide `loader` option if you want to specify the loading spinner (defaults to `loaders.make()`)
    - you can provide `notFound` option, if you want to specify what is shown on invalid routes (defaults to `() => null`)
    - when `auto` is true (default), the router calls `.refresh()` and `.listen()` in the constructor.. set it to `false` if you want manual control
    - you can set `auto` option false if you want to omit the default initial refresh and listen calls
- **render your current page**
    ```ts
    return html`
      <div class="my-page">
        ${router.render()}
      </div>
    `
    ```
    - returns lit content
    - shows a loading spinner when pages are loading
    - will display the notFound content for invalid routes (defaults to null)
- **perform navigations**
    - go to settings page
        ```ts
        await router.nav.settings.go()
          // goes to "#/settings"
        ```
    - go to user page
        ```ts
        await router.nav.user.go("123")
          // goes to "#/user/123"
        ```

### 💅 spa.Router advanced
- **generate a route's hash string**
    ```ts
    const hash = router.nav.user.hash("123")
      // "#/user/123"

    html`<a href="${hash}">user 123</a>`
    ```
- **check if a route is the currently-active one**
    ```ts
    const hash = router.nav.user.active
      // true
    ```
- **force-refresh the router**
    ```ts
    await router.refresh()
    ```
- **force-navigate the router by hash**
    ```ts
    await router.refresh("#/user/123")
    ```
- **get the current hash string (normalized)**
    ```ts
    router.hash
      // "#/user/123"
    ```
- **the `route(...)` helper fn enables the braces-params syntax**
    - but, if you wanna do it differently, you *can* implement your own hash parser to do your own funky syntax
- **dispose the router when you're done with it**
    ```ts
    router.dispose()
      // stop listening to hashchange events
    ```



<br/><br/>
<a id="loot"></a>

## 🪙🦝 loot
> `@e280/sly/loot`  
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

## 🧑‍💻🦝 sly is by e280
reward us with github stars  
build with us at https://e280.org/ but only if you're cool  



<br/><br/>

