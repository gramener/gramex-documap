# @gramex/documap

A visual topic map of documents.

## Example

Given this [document and topics list from the Gettysberg address](docs/gettysberg.json ":ignore"):

```json
{
  "docs": [
    "Four score and seven years ago ...",
    "Now we are engaged in a great civil war ...",
    "We are met on a great battle-field of that war."
    // ...
  ],
  "topics": [
    { "name": "Ideals", "text": "The Founding Ideals of America" },
    { "name": "Purpose", "text": "The Gravity and Purpose of the Civil War" },
    { "name": "Honor", "text": "Respect and Remembrance for the Fallen" },
    { "name": "Responsibility", "text": "The Responsibility of the Living" }
  ],
  "docTopicMap": [
    [0, 0],
    [1, 1],
    [2, 1]
    // ... list of [document id, topic id] mappings
  ]
}
```

... we can render the following documap. (Click on the topics - "Ideals", "Purpose", etc. - to highlight matching documents.)

[![Gettysberg documap](https://code.gramener.com/cto/gramex-documap/-/raw/main/docs/gettysberg.png)](docs/gettysberg.html ":include height=120")

[Here is the source code for the network above](docs/gettysberg.html ":include :type=code")

## Installation

Install via `npm`:

```bash
npm install @gramex/documap
```

Use locally as an ES module:

```html
<script type="module">
  import { documap } from "./node_modules/@gramex/documap/dist/documap.js";
  const chart = documap(...);
</script>
```

Use locally as a script:

```html
<script src="./node_modules/@gramex/documap/documap.min.js"></script>
<script>
  const chart = gramex.documap(...);
</script>
```

Use via CDN as an ES Module:

```html
<script type="module">
  import { documap } from "https://cdn.jsdelivr.net/npm/@gramex/documap@1";
  const chart = documap(...);
</script>
```

Use via CDN as a script:

```html
<script src="https://cdn.jsdelivr.net/npm/@gramex/documap@1/dist/documap.min.js"></script>
<script>
  const chart = gramex.documap(...);
</script>
```

This library uses [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) - an ES2020 feature.

On Babel, [optional-chaining](https://babeljs.io/docs/babel-plugin-transform-optional-chaining) is part of the ES2020 present-env. Run:

```shell
npm install @babel/preset-env --save-dev
```

Then add this to your `babel.config.js` or ``.babelrc`

```json
{
  "presets": ["@babel/preset-env"]
}
```

## CSS styling

You can style the documap using CSS.

[Read the CSS to understand the class used](docs/gettysberg.css ":include :type=code")

## DOM structure

`documap(el, ...)` renders the following HTML on `el`:

```html
<div class="documap-topics">
  <a class="documap-topic" data-documap-topic="0">Topic 1</a>
  <a class="documap-topic active" data-documap-topic="1">Topic 2</a>
  ...
</div>

<div class="documap-docs">
  <svg class="documap-doc" data-documap-doc="0" width="176" height="1rem"></svg>
  <svg class="documap-doc" data-documap-doc="1" width="131" height="1rem">
    <circle class="documap-marker" r="0.4rem" transform="translate(65.5, 8)"></circle>
    ...
  </svg>
  ...
</div>
```

Topics are rendered first.

- All topics are contained in a `<div class="documap-topics">` element. You can [change](#api) the tag and class with `topicsTag` and `topicsClass`.
- Each topic is rendered as `<a class="documap-topic" data-documap-topic="${i}">`. You can [change](#api) the tag and class with `topicTag` and `topicClass`.
- The `data-documap-topic=` attribute contains the topic index (0, 1, 2, ...) in the `topics` array.
- The `active` class is toggled when the topic is clicked. It indicates selected topics. You can [change](#api) the class with `topicActiveClass`.

Documents are rendered next.

- Documents are contained in a `<div class="documap-docs">` element. You can [change](#api) the tag and class with `docsTag` and `docsClass`.
- Each document is rendered as `<svg class="documap-doc" data-documap-doc="${i}" width="${width}" height="${height}">`. You can [change](#api) the tag and class with `docTag` and `docClass`.
- The `data-documap-doc=` attribute contains the document index (0, 1, 2, ...) in the `docs` array.
- The `width` and `height` are set to the `docWidth` and `docHeight` parameters.

When a topic is clicked, it adds marker elements to matching documents.

- Each marker is rendered as `<circle class="documap-marker" r="${markerSize}" transform="translate(${x}, ${y})">`. You can [change](#api) the tag and class with `markerTag` and `markerClass`.
- The `r` attribute is set to the `markerSize` parameter.
- The `transform` attribute is set to the `x` and `y` coordinates of the marker. You can [change](#api) the style with `markerStyle`.

## Style docs and topics

`documap()` returns a `.doc` and a `.topic` D3 join. You can style them like any D3 selection. In this example:

- `chart.doc.attr(doc => ...).style(...)` colors and resizes the documents
- `chart.topic.text(topic => ...).style(...)` colors and re-labels the topics

[![Gettysberg documap with styled docs and topics](https://code.gramener.com/cto/gramex-documap/-/raw/main/docs/gettysberg-style.png)](docs/gettysberg-style.html ":include height=120")

[See how to style docs and topics](docs/gettysberg-style.html ":include :type=code")

## Style markers

"Markers" are the nodes added when the user clicks a topic. You can style them using the `markerStyle` function which accepts a D3 join. In this example:

- `markerStyle: (marker) => marker.style(...)` ensures that `documap()` colors the `marker` D3 join when it is dynamically rendered
- `chart.topic.style(...)` colors the topics

Note: You can't style the markers using the `chart.marker` D3 join because it is empty when the chart is initialized, and is updated dynamically. So we pass a `markerStyle` function instead.
You can use [events](#events) as another way of styling markers.

[![Gettysberg documap styled markers](https://code.gramener.com/cto/gramex-documap/-/raw/main/docs/gettysberg-marker.png)](docs/gettysberg-marker.html ":include height=120")

[See how to style markers](docs/gettysberg-marker.html ":include :type=code")

## Events

After a topic is clicked and markers are added, it fires a cancelable bubbling `update` event on the clicked element. The event has:

- `type`: {string} - `update`
- `target`: {HTMLElement} - the topic clicked
- `detail`: {Object} - contains the following properties:
  - `topicId`: {integer} - the topic index that was clicked
  - `activeTopics`: {D3 join} - the D3 join of the active topics
  - `markers`: {D3 join} - the D3 join of the markers added to the documents

[![Gettysberg documap event handler](https://code.gramener.com/cto/gramex-documap/-/raw/main/docs/gettysberg-event.png)](docs/gettysberg-event.html ":include height=120")

[See how to listen to events](docs/gettysberg-event.html ":include :type=code")

## Add tooltips

You can use [Bootstrap tooltips](https://getbootstrap.com/docs/5.3/components/tooltips/).

1. Add a `data-bs-marker="tooltip" title="..."` attribute to each feature using `update`
2. Call `new bootstrap.Tooltip(element, {selector: '[data-bs-marker="tooltip"]'})` to initialize tooltips

[![Gettysberg documap with tooltips](https://code.gramener.com/cto/gramex-documap/-/raw/main/docs/gettysberg-tooltip.png)](docs/gettysberg-tooltip.html ":include height=120")

[See how to add tooltips](docs/gettysberg-tooltip.html ":include :type=code")

## Add modals

You can use [Bootstrap modals](https://getbootstrap.com/docs/5.3/components/modal/).

1. Create a new `new bootstrap.Modal(document.querySelector("..."));`
2. Use `chart.doc.on()` or `chart.topic.on()` or `chart.marker.on()` to listen to `click` events and update the modal content.

[![Gettysberg documap with modals](https://code.gramener.com/cto/gramex-documap/-/raw/main/docs/gettysberg-modal.png)](docs/gettysberg-modal.html ":include height=400")

[See how to add modals](docs/gettysberg-modal.html ":include :type=code")

## Bring your own D3

If you already have D3 loaded, or want to use a specific version / instance of D3, pass it to `documap(el, { d3 })`:

[![Gettysberg documap with pinned D3 version](https://code.gramener.com/cto/gramex-documap/-/raw/main/docs/gettysberg.png)](docs/gettysberg-d3.html ":include height=120")

[See how to use your own D3 version](docs/gettysberg-d3.html ":include :type=code")

## React usage

Use the following pattern when using documap with React:

```js
const { useEffect } = React;
function App() {
  useEffect(() => documap(d3.select("#documap"), { ... }), []);
  return React.createElement("div", { id: "documap" });
}
const root = ReactDOM.createRoot(document.querySelector("#root"));
root.render(React.createElement(React.StrictMode, null, React.createElement(App)));
```

[![Gettysberg documap with React](https://code.gramener.com/cto/gramex-documap/-/raw/main/docs/gettysberg.png)](docs/gettysberg-react.html ":include height=120")

[See how to use documap with React](docs/gettysberg-react.html ":include :type=code")

Here are instructions to create a React Component:

```shell
npx create-react-app documap-react
cd documap-react
npm install d3 @gramex/documap
```

In `public/index.html`, add the line:

```html
<link rel="stylesheet" href="https://gramener.com/gramex-documap/docs/gettysberg.css" />
```

Create `src/DocumapComponent.js` with this code:

[See DocumapComponent.js code](docs/documap-react/src/DocumapComponent.js ":include :type=code")

Modify `src/App.js` as follows:

[See App.js code](docs/documap-react/src/App.js ":include :type=code")

Then run `npm start` or `npm run build`.

[Explore the code](https://code.gramener.com/cto/gramex-documap/-/tree/main/docs/documap-react ":ignore").

## API

[See API documentation](docs/api.md ":include :type=markdown")

## Release notes

- 1.0.2: 23 Nov 2023. Document React usage and fix React compatibility
- 1.0.1: 17 Oct 2023. Use `chart.marker` instead of `chart.markers` for consistency. Add docs.
- 1.0.0: 16 Oct 2023. Initial release

## Authors

- Anand S <s.anand@gramener.com>
- Aayush Thakur <aayush.thakur@gramener.com>
- Chandana Sagar <chandana.sagar@gramener.com>

## License

[MIT](https://spdx.org/licenses/MIT.html)
