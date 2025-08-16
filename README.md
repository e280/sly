
<div align="center"><img alt="" width="256" src="./assets/favicon.png"/></div>

# 🦝 sly — mischievious frontend web framework
- 🪄 magic frontend framework for [lit](https://lit.dev/)
- 🪝 hooks syntax with `use`
- 🪨 sly is the successor to [@benev/slate](https://github.com/benevolent-games/slate)
- 🏂 commonly used with stz standard library [@e280/stz](https://github.com/e280/stz)
- ⛏️ integrates signals and state trees via [@e280/strata](https://github.com/e280/strata)
- 🐢 see [scute](https://github.com/e280/scute) if you need a buildy-bundler-buddy
- 🧑‍💻 an [@e280](https://e280.org/) project

<br/>

## 📦 install sly, stz, strata, lit

```sh
npm install @e280/sly @e280/stz @e280/strata lit
```

<br/>

## 🏞️ view
views are the crown jewel of sly. shadow-dom'd, hooks-based, fancy ergonomics.

### 🍋 basic view example
> views are hooks-based functional components. they are *not* web components nor *custom elements*, yet they are encapsulated within a [shadow root](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM).

#### `counter.ts`
```ts
import {view} from "@e280/sly"
import {html, css} from "lit"

export const CounterView = view(use => (start: number) => {
  use.name("counter")
  use.styles(css`p {color: green}`)
  const count = use.signal(start)

  return html`
    <p>count ${count()}</p>
    <button @click="${() => { count.value++ }}"></button>
  `
})
```
- each view is wrapped in a `<sly-view view="counter">` custom host element
- your provided `name` is set as the `view` attribute on the host

#### `counter.bundle.ts`
```ts
import {render, html} from "lit"
import {CounterView} from "./my-counter.js"

const content = html`
  <h1>my demo page</h1>
  ${CounterView(1)}
`

render(content, document.body)
```

### 🍋 view `use`
> super special view helper, with hooks and other goodies

- **use.signal** — create a [strata signal](https://github.com/e280/strata)
    ```ts
    const count = use.signal(1)

    // read the signal
    count() //-> 1

    // write the signal
    count(2)
    ```
- **use.once** — run a fn one time, when view is initially injected into dom
    ```ts
    const whatever = use.once(() => {
      console.log("happens only once")
      return 123
    })

    whatever //-> 123
    ```
- **use.mount** — establish a lifecycle for when the view mounts and unmounts
    ```ts
    use.mount(() => {
      console.log("view mounted")

      return () => {
        console.log("view unmounted")
      }
    })
    ```
- **use.name** — set the "view" attr value, eg `<sly-view view="squarepants">`
    ```ts
    use.name("squarepants")
    ```
- **use.styles** — attach one or more stylesheets into the view's shadow dom
    ```ts
    use.styles(css1, css2, css3)
    ```

### 🍋 cool tricks to impress the ladies
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

### 🍋 view.settings
> declaring a view? optionally provide `settings`

#### `cool-view.ts`
```ts
import {view} from "@e280/sly"
import {html} from "lit"

export const CoolView = view
  .settings({mode: "open", delegatesFocus: true})
  .view(use => (greeting: string) => {

  return html`😎 ${greeting} <slot></slot>`
})
```
- see the way the `settings` are this optional sneaky thing?
- these `settings` like `mode` and `delegatesFocus` are [attachShadow params](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#parameters)
- note the `<slot></slot>` we'll use in the next example lol

### 🍋 view injection options
> injecting a view? optionally provide more options like `attrs` and `content`

#### `cool.bundle.ts`
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

render(content, document.body)
```
- `attr` — set html attributes on the `<sly-view>` host element
- `children` — nested content of the `<sly-view>` host element, thus it's getting slotted into the shadow dom `<slot>`.. confused? do some reading on [slots](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots)
- `props` — finally inject the view by providing its props

