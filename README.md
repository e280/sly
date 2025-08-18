
<div align="center"><img alt="" width="256" src="./assets/favicon.png"/></div>

# 🦝 sly — mischievous shadow views
> testing page at https://sly.e280.org/

- 🪒 lean view framework for [lit](https://lit.dev/) web devs
- 🌅 sly is the successor to [@benev/slate](https://github.com/benevolent-games/slate)
- 🏂 commonly used with stz standard library [@e280/stz](https://github.com/e280/stz)
- ⛏️ integrates signals and state trees from [@e280/strata](https://github.com/e280/strata)
- 🐢 if you need a buildy-bundler-buddy, try [scute](https://github.com/e280/scute)
- 🧑‍💻 project by [@e280](https://e280.org/)

<br/>

## 🦝 INSTALL SLY AND PALS

```sh
npm install @e280/sly @e280/stz @e280/strata lit
```

<br/>

## 🦝 SLY VIEWS
views are the crown jewel of sly. shadow-dom'd. hooks-based. fancy ergonomics. not components.

views are leaner than web components.. no dom registration, no string tag names.. just import 'em, and the types work.. web components are fine, but they're for providing html authors with entrypoints to your cool widgets.. whereas views are the building blocks for frontend app devs.

sly views are wired to automatically rerender whenever they're using any state stuff from [@e280/strata](https://github.com/e280/strata).

- a minimal view looks like this:
    ```ts
    import {view} from "@e280/sly"

    view(use => () => "hello world")
    ```

### 🍋 view example
- views are hooks-based functional components with a [shadow root](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)
- **declaring a view**
    ```ts
    import {view} from "@e280/sly"
    import {html, css} from "lit"

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
- **injecting a view into the dom**
    ```ts
    import {render, html} from "lit"
    import {CounterView} from "./my-counter.js"

    const content = html`
      <h1>my demo page</h1>
      ${CounterView(1)}
    `

    render(content, document.querySelector(".app")!)
    ```

### 🍋 view declaration settings
- special settings for views at declaration-time
    ```ts
    import {view} from "@e280/sly"
    import {html} from "lit"

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
    import {render, html} from "lit"
    import {CoolView} from "./cool-view.js"

    const content = html`
      <h2>super cool example</h2>
      ${CoolView
        .attr("class", "hero")
        .children(html`<em>spongebob</em>`)
        .props("hello")}
    `

    render(content, document.querySelector(".app")!)
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
- **use.render** — force a hard render (not debounced)
    ```ts
    use.render()
    ```
- **use.rendered** — promise that resolves *after* the next render
    ```ts
    use.rendered.then(() => {
      const slot = use.shadow.querySelector("slot")!
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
    import {$} from "@e280/sly"

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

## 🦝 SLY'S `$` DOM MULTITOOL
- import the `$` and it has a bunch of goodies
    ```ts
    import {$} from "@e280/sly"
    ```
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
> ***TODO*** *we need to write real docs for this, lol*
- `Pod` is a type for loading/ready/error states
- `podium` is a tool with fns for working with pods
- `Op` class wraps a pod signal and has some ergonomic fns
- `makeLoader(anims.bar2)` makes it easy to create a loader
  - see the available `anims` on the testing page: https://sly.e280.org/
  - a loader's job is to render an op, with a nice loading anim and error display view

<br/>

## 🧑‍💻 SLY BY E280
reward us with github stars  
build with us at https://e280.org/ but only if you're cool  

