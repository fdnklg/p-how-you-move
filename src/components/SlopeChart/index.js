/** @jsx jsx */
import { jsx, Box } from "theme-ui";
import React, { useEffect, useState } from "react";

import { select, scaleLinear, axisLeft, axisRight, scaleLog, path, easeCubicInOut, transition as d3Transition } from "d3";

import SlopeButtonGroup from './SlopeButtonGroup';

export default p => {
  const { data } = p;
  const [compareType, setCompareType] = useState('time');
  const [slopeLine, setSlopeline] = useState(null);
  const [dotsRight, setDotsRight] = useState(null);
  const [labelRight, setLabelRight] = useState(null);
  const [scalePercent, setScalePercent] = useState(null);
  let svg = null;
  let width = null;
  let height = null;
  let heightMinusMargin = null;
  let widthtMinusMargin = null;
  let axisTime = null;
  let axisDistance = null;
  let transition = d3Transition()
    .duration(750)
    .ease(easeCubicInOut);

  let lineTime = null;
  let lineDistance = null;
  let dotsLeft = null;

  const total = data.find(d => d.id === "TOTAL");
  const filteredData = data.filter(d => ((d.id !== "TOTAL")));

  let totalDistance = 0;
  let totalTime = 0;
  let totalCount = 0;

  filteredData.forEach(item => {
    totalTime += item.durationMs;
    totalDistance += item.distanceM;
    totalCount += item.count
  });

  // make comparision easy and convert absolute to relative values
  const distanceOnePercent = totalDistance / 100;
  const timeOnePercent = totalTime / 100;
  const countOnePercent = totalCount / 100;

  const maxDistance = filteredData.reduce((prev, current) =>
    prev.distanceM > current.distanceM ? prev : current
  ).distanceM;
  const maxTime = filteredData.reduce((prev, current) =>
    prev.durationMs > current.durationMs ? prev : current
  ).durationMs;
  const maxCount = filteredData.reduce((prev, current) =>
    prev.count > current.count ? prev : current
  ).count;

  const maxPercentDistance = maxDistance / distanceOnePercent;
  const maxPercentTime = maxTime / timeOnePercent;
  const maxPercentCount = maxCount / countOnePercent;

  const maxPercent =
    maxPercentDistance > maxPercentTime
      ? Math.ceil(maxPercentDistance)
      : Math.ceil(maxPercentTime);

  // console.log(maxDistance, maxTime)

  const calcYPos = (d, type, scale) => {
    if (type=='time') {
      return scale(d.durationMs / timeOnePercent)
    }
    if (type=='distance') {
      return scale(d.distanceM / distanceOnePercent)
    }
    if (type=='count') {
      return scale(d.count / countOnePercent)
    }
  }

  let scaleDistance = null;

  const margin = {
    top: 50,
    right: 80,
    bottom: 50,
    left: 80
  };

  useEffect(() => {
    init(data);
  }, []);

  useEffect(() => {
    update();
  }, [compareType]);

  const init = data => {
    const wrapper = select("#slope");
    width = wrapper.node().clientWidth;
    height = wrapper.node().clientHeight;

    heightMinusMargin = height - margin.top - margin.bottom;
    widthtMinusMargin = width - margin.left - margin.right;

    svg = wrapper
      .append("svg") //this appends the SVG
      .attr("width", width) // add margin here later
      .attr("height", height); // add margin here later

    const sc = scaleLinear()
      .domain([maxPercent, 0])
      .range([0, heightMinusMargin]);

    setScalePercent(() => sc)
    scaleDistance = sc;

    axisTime = axisLeft(sc);
    axisDistance = axisRight(sc);

    lineTime = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(axisTime);

    lineDistance = svg
      .append("g")
      .attr("transform", `translate(${width - margin.right}, ${margin.top})`)
      .call(axisDistance);

    dotsLeft = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .selectAll("circle")
      .data(filteredData)
      .join("circle")
      .attr("cx", 0)
      .attr("cy", d => sc(d.durationMs / timeOnePercent))
      .attr("r", 3)
      .attr("id", d => d.id)
      .attr("fill", d => d.color);

    const labelLeft = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .selectAll("text")
      .data(filteredData)
      .join('text')
      .attr('x', 0)
      .attr("y", d => sc(d.durationMs / timeOnePercent))
      .text(d => d.id)
      .attr('text-anchor', 'end')

    const lr = svg
      .append("g")
      .attr("transform", `translate(${width - margin.right}, ${margin.top})`)

    lr
      .selectAll("text")
      .data(filteredData)
      .join('text')
      .attr('x', 0)
      .attr("y", d => calcYPos(d, compareType, sc))
      .text(d => d.id)

    setLabelRight(lr)

    const dr = svg
      .append("g")
      .attr("transform", `translate(${width - margin.right}, ${margin.top})`)

    dr
      .selectAll("circle")
      .data(filteredData)
      .join("circle")
      .attr("cx", 0)
      .attr("cy", d => calcYPos(d, compareType, sc))
      .attr("r", 3)
      .attr("id", d => d.id)
      .attr("fill", d => d.color);

    setDotsRight(dr)

    let sl = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)

    sl
      .selectAll("line")
      .data(filteredData)
      .join("line")
      .attr("x1", 0)
      .attr("y1", d => sc(d.durationMs / timeOnePercent))
      .attr("x2", widthtMinusMargin)
      .attr("y2", d => calcYPos(d, compareType, sc))
      .attr("stroke", d => d.color);

    setSlopeline(sl);
  };

  const update = () => {
    if (slopeLine) {
      slopeLine
        .selectAll("line")
        .transition(transition)
        .delay((d, i) => {
          return i * 0.5;
        })
        .attr("y2", d => calcYPos(d, compareType, scalePercent))

      dotsRight
        .selectAll("circle")
        .transition(transition)
        .delay((d, i) => {
          return i * 0.5;
        })
        .attr("cy", d => calcYPos(d, compareType, scalePercent))

      labelRight
        .selectAll("text")
        .transition(transition)
        .delay((d, i) => {
          return i * 0.5;
        })
        .attr("y", d => calcYPos(d, compareType, scalePercent))
    }
  }

  return (
    <>
      <Box
        id="slope"
        sx={{
          width: ["500px"],
          height: "500px",
          mt: ["5"],
          fontSize: '0'
        }}
      ></Box>
      <SlopeButtonGroup selectToggle={setCompareType} data={compareType}/>
    </>
  );
};
