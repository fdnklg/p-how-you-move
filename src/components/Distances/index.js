/** @jsx jsx */
import { jsx, Box } from "theme-ui";
import { useStoreState } from "easy-peasy";
import React, { useEffect, useState } from "react";

import ButtonGroup from "./ButtonGroup";

import {
  select as d3Select,
  scaleLinear as d3ScaleLinear,
  path as d3Path,
  transition as d3Transition,
  easeCubicInOut
} from "d3";

export default p => {
  const { data } = p;
  const { activities } = data;
  const highlighted = useStoreState(s => s.highlighted);

  let width = null;
  let height = null;
  let svg = null;
  let scaleDistance = null;
  let scaleDuration = null;
  let distances = null;
  let [dist, setDist] = useState(null);
  let longer = false;
  let select = "WALKING";
  let isVisit = (d) => (d.activityType === 'VISIT');
  let nodes = [];
  let transition = d3Transition()
    .duration(750)
    .ease(easeCubicInOut);

  const margin = {
    top: "10px",
    right: "10px",
    bottom: "10px",
    left: "10px"
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (dist) update(dist);
  }, [highlighted]);

  const minWidth = val => {
    return val < 1 ? 2 : val;
  };

  // https://stackoverflow.com/questions/40105387/drawing-a-specific-number-of-rects-d3-js
  // Build displayed data below
  const initData = (data, width) => {
    var posX = 0;
    var posY = 0;

    // Calculate position of each node
    for (var i in data) {
      var node =
        data[i].activityType == "VISIT"
          ? addNode(3, data[i], posX, posY)
          : addNode(scaleDistance(data[i].distance), data[i], posX, posY);

      // If there is an overflow
      if (node.x + node.value > width) {
        var overflowValue = node.x + node.value - width;

        // Add nodes until there is no more overflow
        while (overflowValue > 0) {
          // Update current node value
          node.value = width - node.x;
          // Calculate new node posX and posY
          posX = 0;
          posY += 10 + 2;
          // Claculate new overflow
          node = addNode(overflowValue, data[i], posX, posY);
          overflowValue = node.x + node.value - width;
        }
      }
      posX += node.value + 3;
    }

    return nodes;
  };

  const addNode = (value, obj, x, y) => {
    var newNode = {
      ...obj,
      value: minWidth(value),
      x: x,
      y: y
    };
    nodes.push(newNode);
    return newNode;
  };

  const init = () => {
    const wrapper = d3Select("#distances");
    width = wrapper.node().clientWidth;
    height = wrapper.node().clientHeight;

    svg = wrapper
      .append("svg") //this appends the SVG
      .attr("width", width) // add margin here later
      .attr("height", height); // add margin here later

    scaleDistance = d3ScaleLinear()
      .domain([0, 15000000])
      .nice()
      .range([0, 10000]);

    scaleDuration = d3ScaleLinear()
      .domain([0, 15000000])
      .nice()
      .range([0, 10000]);

    distances = svg.append("g");

    distances
      .selectAll("rect")
      .data(initData(activities, width))
      .join("rect")
      .attr("x", (d, i) => isVisit(d) ? d.x + 1 : d.x)
      .attr("fill", d => isVisit(d) ? 'none' : d.color)
      .attr("stroke", d => isVisit(d) ? d.color : 'none')
      .attr("width", d => 0)
      .attr("opacity", "0")
      .attr("y", (d, i) => isVisit(d) ? d.y - 2 : d.y)
      .attr("height", d => isVisit(d) ? 5 : 1)

    setDist(distances);

    update(distances);
  };

  const update = node => {
    node
      .selectAll("rect")
      .transition(transition)
      .delay((d, i) => {
        return i * 0.5;
      })
      .attr("width", d => isVisit(d) ? .5 : minWidth(d.value))
      .attr("opacity", (d,i) => {
        if (highlighted === "TOTAL") {
          return 1;
        }
        if (d.activityType === highlighted) {
          return 1;
        } else if (d.activityType === 'VISIT' ) {
          return 0.25;
        } else {
          return .1
        }
      });
  };

  return (
    <Box
      id="distances"
      sx={{
        width: ["90%", "75%", "75%"],
        height: "100%",
        mt: ["5"]
      }}
    >
      <ButtonGroup />
    </Box>
  );
};
