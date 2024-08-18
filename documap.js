import { layer } from "@gramex/chartbase";

/**
 * Creates a document map on the specified element with the given parameters
 *
 * @param {string|HTMLElement|d3.selection} el - A string selector, HTML element, or D3 selection.
 * @param {Object} params - Configuration options.
 * @param {Array} params.docs - Document elements to be rendered.
 * @param {string|Function} [params.docsTag="div"] - Tag name for the documents container.
 * @param {string|Function} [params.docsClass="documap-docs"] - Class name for the documents container.
 * @param {string|Function} [params.docTag="svg"] - Tag name for each document element.
 * @param {string|Function} [params.docClass="documap-doc"] - Class name for each document element.
 * @param {string|Function} [params.docWidth="5rem"] - Width of each document element.
 * @param {string|Function} [params.docHeight="1rem"] - Height of each document element.
 * @param {Array} params.topics - Topics to be mapped on the document.
 * @param {string|Function} [params.topicsTag="div"] - Tag name for the topics container.
 * @param {string|Function} [params.topicsClass="documap-topics"] - Class name for the topics container.
 * @param {string|Function} [params.topicTag="a"] - Tag name for each topic element.
 * @param {string|Function} [params.topicClass="documap-topic"] - Class name for each topic element.
 * @param {string|Function} [params.topicActiveClass="active"] - Class name for each active topic element.
 * @param {string|Function} [params.topicLabel=d => d] - Label for each topic element.
 * @param {Array} params.docTopicMap - `[docIndex, topicIndex]` array mapping documents to topics.
 * @param {string|Function} [params.markerTag="circle"] - Tag name for each marker element.
 * @param {string|Function} [params.markerClass="documap-marker"] - Class name for each marker element.
 * @param {string|Function} [params.markerSize="0.4rem"] - Size of each marker element.
 * @param {Function} [params.markerStyle=() => {}] - Function called on the marker join.
 * @param {Object} [params.d3=window.d3] - D3 instance to use.
 * @returns {DocumapChart} - with individual D3 selections.
 * @emits UpdateEvent
 */
export function documap(
  el,
  {
    docs,
    // <div class="documap-docs">
    //    <svg class="documap-doc" data-documap-doc="${i}" width="5rem" height="1rem"></svg>
    docsTag = "div",
    docsClass = "documap-docs",
    docTag = "svg",
    docClass = "documap-doc",
    docWidth = "5rem",
    docHeight = "1rem",
    topics,
    // <div class="documap-topics">
    //    <a class="documap-topic">${topicLabel(d)}</a>
    topicsTag = "div",
    topicsClass = "documap-topics",
    topicTag = "a",
    topicClass = "documap-topic",
    topicActiveClass = "active",
    topicLabel = (d) => d,
    // Markers are placed inside the doc as
    //    <circle class="documap-marker" data-documap-topic="${i}"></circle>
    markerTag = "circle",
    markerClass = "documap-marker",
    markerSize = "0.4rem",
    markerStyle = () => {},
    docTopicMap,
    d3 = globalThis.d3,
  },
) {
  // If el is already a D3 element, use it (with it's version of D3). Else use the provided D3
  const root = el._groups ? el : d3.select(el);

  const topicsLayer = layer(root, topicsTag, topicsClass);
  const topicLayer = layer(topicsLayer, topicTag, topicClass, topics)
    .text(topicLabel)
    .attr("data-documap-topic", (d, i) => i);
  const docsLayer = layer(root, docsTag, docsClass);
  const docLayer = layer(docsLayer, docTag, docClass, docs)
    .attr("width", docWidth)
    .attr("height", docHeight)
    .attr("data-documap-doc", (d, i) => i);

  let markerLayer = layer(docLayer, markerTag, markerClass, []);
  /**
   * @typedef {Object} DocumapChart
   * @property {d3.selection} docs - D3 join of the documents container (single node).
   * @property {d3.selection} topics - D3 join of the topics container (single node).
   * @property {d3.selection} marker - D3 join of the markers displayed (if any topics are active).
   * @property {d3.selection} doc - D3 join of the documents (as many nodes as `docs`).
   * @property {d3.selection} topic - D3 join of the topics (as many nodes as `topics`).
   */
  const chart = {
    doc: docLayer,
    topic: topicLayer,
    marker: markerLayer,
    docs: docsLayer,
    topics: topicsLayer,
  };

  topicLayer.on("click.update", function () {
    this.classList.toggle(topicActiveClass);
    chart.update();
  });

  chart.update = function ({ topics: activateTopics } = {}) {
    if (activateTopics) topicLayer.classed("active", activateTopics);
    const activeTopics = topicsLayer
      .selectAll(".active")
      .data()
      .map((topic) => topics.indexOf(topic));
    const markerData = docs.map((doc, docId) =>
      docTopicMap.filter(([dId, tId]) => dId === docId && activeTopics.includes(tId)),
    );
    chart.marker = markerLayer = layer(docLayer, markerTag, markerClass, (d, i) => markerData[i])
      .attr("data-documap-topic", (d) => d.topicId)
      .attr("r", markerSize)
      .attr("transform", (d, i, nodes) => {
        // Assume docTag is an SVG. Distribute markers horizontally inside.
        const container = nodes[i].parentNode;
        const width = container?.viewBox?.animVal?.width || container?.width?.animVal?.value;
        const height = container?.viewBox?.animVal?.height || container?.height?.animVal?.value;
        return `translate(${(i + 1) * (width / (nodes.length + 1))}, ${height / 2})`;
      })
      .call(markerStyle);
  };

  return chart;
}
