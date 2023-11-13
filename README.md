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

[![Gettysberg documap with tooltips](https://code.gramener.com/cto/gramex-network/-/raw/main/docs/gettysberg-tooltip.png)](docs/gettysberg-tooltip.html ":include height=120")

[See how to add tooltips](docs/gettysberg-tooltip.html ":include :type=code")

## Add modals

You can use [Bootstrap modals](https://getbootstrap.com/docs/5.3/components/modal/).

1. Create a new `new bootstrap.Modal(document.querySelector("..."));`
2. Use `chart.doc.on()` or `chart.topic.on()` or `chart.marker.on()` to listen to `click` events and update the modal content.

[![Gettysberg documap with modals](https://code.gramener.com/cto/gramex-network/-/raw/main/docs/gettysberg-modal.png)](docs/gettysberg-modal.html ":include height=400")

[See how to add modals](docs/gettysberg-modal.html ":include :type=code")

## Bring your own D3

If you already have D3 loaded, or want to use a specific version / instance of D3, pass it to `documap(el, { d3 })`:

[![Gettysberg documap with pinned D3 version](https://code.gramener.com/cto/gramex-documap/-/raw/main/docs/gettysberg-d3.png)](docs/gettysberg-d3.html ":include height=120")

[See how to use your own D3 version](docs/gettysberg-d3.html ":include :type=code")

## React usage

## API

The `documap()` function creates a document map. It accepts the following parameters:

- `el`: {string|HTMLElement|D3 Selection} - The selector, HTML element, or D3 selection to render the documap on.
- `params`: {Object} - Parameters for the visualization.
  - `docs`: {Array} - document elements to be rendered.
  - `docsTag`: {string|Function} - tag name for the documents container. default: `div`.
  - `docsClass`: {string|Function} - class name for the documents container. default: `documap-docs`.
  - `docTag`: {string|Function} - tag name for each document element. default: `svg`.
  - `docClass`: {string|Function} - class name for each document element. default: `documap-doc`.
  - `docWidth`: {string|Function} - width of each document element. default: `5rem`.
  - `docHeight`: {string|Function} - height of each document element. default: `1rem`.
  - `topics`: {Array} - topics to be mapped on the document
  - `topicsTag`: {string|Function} - tag name for the topics container. default: `div`.
  - `topicsClass`: {string|Function} - class name for the topics container. default: `documap-topics`.
  - `topicTag`: {string|Function} - tag name for each topic element. default: `a`.
  - `topicClass`: {string|Function} - class name for each topic element. default: `documap-topic`.
  - `topicActiveClass`: {string|Function} - class name for each active topic element. default: `active`.
  - `topicLabel`: {string|Function} - label for each topic element. default: `d => d`.
  - `docTopicMap`: {Array} - `[docIndex, topicIndex]` array mapping documents to topics
  - `markerTag`: {string|Function} - tag name for each marker element. default: `circle`.
  - `markerClass`: {string|Function} - class name for each marker element. default: `documap-marker`.
  - `markerSize`: {string|Function} - size of each marker element. default: `0.4rem`.
  - `markerStyle`: {Function} - called on the marker join. default: `() => {}`.
  - `d3`: {Object} - d3 instance to use. default: `window.d3`.

It returns an object with the following properties:

- `docs`: {Selection} - D3 join of the documents container (single node)
- `topics`: {Selection} - D3 join of the topics container (single node)
- `marker`: {Selection} - D3 join of the markers displayed (if any topics are active)
- `doc`: {Selection} - D3 join of the documents (as many nodes as `docs`)
- `topic`: {Selection} - D3 join of the topics (as many nodes as `topics`)

It dispatches an `update` event when a topic is clicked. The event contains the following properties:

- `type`: {string} - `update`
- `target`: {HTMLElement} - the topic clicked
- `detail`: {Object} - contains the following properties:
  - `topicId`: {integer} - the topic index that was clicked
  - `activeTopics`: {D3 join} - the D3 join of the active topics
  - `markers`: {D3 join} - the D3 join of the markers added to the documents

## Release notes

<!--
- 1.0.0: 31 Oct 2023. Initial release
-->

## Authors

- Anand S <s.anand@gramener.com>
- Aayush Thakur <aayush.thakur@gramener.com>
- Chandana Sagar <chandana.sagar@gramener.com>

## License

[MIT](https://spdx.org/licenses/MIT.html)
