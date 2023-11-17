import { layer } from "@gramex/chartbase";

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
  const chart = {
    doc: docLayer,
    topic: topicLayer,
    marker: markerLayer,
    docs: docsLayer,
    topics: topicsLayer,
  };

  topicLayer.on("click.update", function (event, topic) {
    this.classList.toggle(topicActiveClass);
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
    // Dispatch an update event
    this.dispatchEvent(
      new CustomEvent("update", {
        bubbles: true,
        cancelable: true,
        detail: {
          topic,
          topicId: +this.dataset.documapTopic,
          activeTopics: activeTopics,
          marker: markerLayer,
        },
      }),
    );
  });

  return chart;
}
