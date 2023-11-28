import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { documap } from "@gramex/documap";

const DocumapComponent = () => {
  const [data, setData] = useState({});
  const documapRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch("https://gramener.com/gramex-documap/docs/gettysberg.json");
      const json = await result.json();
      setData(json);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data.docs && documapRef.current) {
      documap(d3.select(documapRef.current), {
        docs: data.docs,
        topics: data.topics,
        docTopicMap: data.docTopicMap,
        docWidth: (d) => d.length + 2,
        topicLabel: (d) => d.name,
      });
    }
  }, [data]);

  return <div ref={documapRef} />;
};

export default DocumapComponent;
