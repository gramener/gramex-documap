import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { documap } from "@gramex/documap";

const DocumapComponent = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch("https://gramener.com/gramex-documap/docs/gettysberg.jsongettysberg.json");
      const json = await result.json();
      setData(json);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data.docs) {
      documap(d3.select("#documap"), {
        docs: data.docs,
        topics: data.topics,
        docTopicMap: data.docTopicMap,
        docWidth: (d) => d.length + 2,
        topicLabel: (d) => d.name,
      });
    }
  }, [data]);

  return <div id="documap" />;
};

export default DocumapComponent;
