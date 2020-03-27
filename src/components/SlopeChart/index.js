/** @jsx jsx */
import { jsx, Box } from "theme-ui";
import React, { useEffect } from "react";

import { select, scaleLinear, axisLeft, axisRight, scaleLog, path } from "d3";

export default p => {
  const { data } = p;
  let svg = null;
  let width = null;
  let height = null;
  let heightMinusMargin = null;
  let widthtMinusMargin = null;
  let axisTime = null;
  let axisDistance = null;

  let lineTime = null;
  let lineDistance = null;
  let dotsLeft = null;
  let dotsRight = null;
  let slopeLine = null;

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

  let scaleDistance = null;
  let scaleTime = null;

  const margin = {
    top: 50,
    right: 80,
    bottom: 50,
    left: 80
  };

  useEffect(() => {
    init(data);
  }, []);

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

    scaleDistance = scaleLinear()
      .domain([maxPercent, 0])
      .range([0, heightMinusMargin]);

    scaleTime = scaleLinear()
      .domain([maxPercent, 0])
      .range([0, heightMinusMargin]);

    axisTime = axisLeft(scaleTime);
    axisDistance = axisRight(scaleDistance);

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
      .attr("cy", d => scaleTime(d.count / countOnePercent))
      .attr("r", 3)
      .attr("id", d => d.id)
      .attr("fill", d => d.color);

    dotsRight = svg
      .append("g")
      .attr("transform", `translate(${width - margin.right}, ${margin.top})`)
      .selectAll("circle")
      .data(filteredData)
      .join("circle")
      .attr("cx", 0)
      .attr("cy", d => scaleDistance(d.durationMs / timeOnePercent))
      .attr("r", 3)
      .attr("id", d => d.id)
      .attr("fill", d => d.color);

    slopeLine = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .selectAll("line")
      .data(filteredData)
      .join("line")
      .attr("x1", 0)
      .attr("y1", d => scaleTime(d.count / countOnePercent))
      .attr("x2", widthtMinusMargin)
      .attr("y2", d => scaleDistance(d.durationMs / timeOnePercent))
      .attr("stroke", d => d.color);
  };

  const updata = () => {

  }

  return (
    <Box
      id="slope"
      sx={{
        width: ["500px"],
        height: "600px",
        mt: ["5"]
      }}
    ></Box>
  );
};
