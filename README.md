# gramex-documap

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
    // ...
  ]
}
```

... we can render the following documap:

[![Gettysberg documap](https://code.gramener.com/cto/gramex-documap/-/raw/main/docs/gettysberg.png)](docs/gettysberg.html ":include")

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
</script>
```

Use locally as a script:

```html
<script src="./node_modules/@gramex/documap/documap.min.js"></script>
<script>
  gramex.documap(...)
</script>
```

Use via CDN as an ES Module:

```html
<script type="module">
  import { documap } from "https://cdn.jsdelivr.net/npm/@gramex/documap@1";
</script>
```

Use via CDN as a script:

```html
<script src="https://cdn.jsdelivr.net/npm/@gramex/documap@1/dist/documap.min.js"></script>
<script>
  gramex.documap(...)
</script>
```

## API

The `documap()` function creates a document map. It accepts the following parameters:

- `el`: {string|HTMLElement} - The selector or HTML element for the SVG.
- `params`: {Object} - Parameters for the visualization.
  - `docs`: {Array} - document elements to be rendered.
  - `docText`: {string|Function} - doc element text accessor
  - `docTitle`: {string|Function} - doc element title accessor
  - `docGroups`: {string|string[]|Function} - doc element group / group hierarchy accessor
  - `topics`: {Array} - topics to be mapped on the document
  - `topicName`: {string|Function} - display topic name accessor
  - `topicText`: {string|Function} - topic tooltip accessor
  - `docTopicMap`: {Array} - `[docIndex, topicIndex]` array mapping documents to topics

<!--
    - e.g. if `docGroups` returns "Overview", the doc element belongs under the "Overview" section
    - e.g. if `docGroups` returns `["Overview", "API"]`, the doc element belongs under the "API" section under the "Overview" section
      - e.g. `[[0, 0], [0, 3], [1, 2], [1, 3], ...]`
-->

It returns:

TODO

## Examples

TODO

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
