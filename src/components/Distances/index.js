/** @jsx jsx */
import { jsx, Box } from 'theme-ui';
import {useStoreActions} from 'easy-peasy';
import React, {useEffect} from 'react';

import {
  select as d3Select,
  scaleLinear as d3ScaleLinear,
  path as d3Path
} from 'd3';

export default p => {
  const { data } = p;
  const { activities } = data;

  let width = null;
  let height = null;
  let svg = null;
  let scaleDistance = null;
  let scaleDuration = null;
  let distances = null;
  let longer = false;
  let nodes = [];

  const margin = {
    top: '10px',
    right: '10px',
    bottom: '10px',
    left: '10px',
  }

  useEffect(() => {
    init();
  }, [])

  const minWidth = val => {
    return val < 1 ? 2 : val;
  }

  // https://stackoverflow.com/questions/40105387/drawing-a-specific-number-of-rects-d3-js
  // Build displayed data below
  const initData = (data, width) => {
    var posX = 0;
    var posY = 0;

    // Calculate position of each node
    for (var i in data) {
      var node = addNode(scaleDistance(data[i].distance),data[i] , posX, posY);

      // If there is an overflow
      if (node.x + node.value > width) {
        var overflowValue = node.x + node.value - width;

        // Add nodes until there is no more overflow
        while (overflowValue > 0) {
          // Update current node value
          node.value = width - node.x;
          // Calculate new node posX and posY
          posX = 0;
          posY += 10 + 3;
          // Claculate new overflow
          node = addNode(overflowValue, data[i], posX, posY);
          overflowValue = node.x + node.value - width;
        }
      }
      posX += node.value + 3;
    }

    return nodes;
  }

  const addNode = (value, obj, x, y) => {
    var newNode = {
      ...obj,
      value: minWidth(value),
      x: x,
      y: y
    };
    nodes.push(newNode);
    return newNode;
  }

  const init = () => {
    const wrapper = d3Select('#distances')
    width = wrapper.node().clientWidth
    height = wrapper.node().clientHeight

    svg = wrapper
      .append("svg") //this appends the SVG
      .attr("width", width) // add margin here later
      .attr("height",  height) // add margin here later

    scaleDistance = d3ScaleLinear()
      .domain([0, 15000000]).nice()
      .range([0, 10000])
    
    scaleDuration = d3ScaleLinear()
      .domain([0, 15000000]).nice()
      .range([0, 10000])
    
    distances = svg.append('g')
      .selectAll('rect')
      .data(initData(activities, width))
      .join('rect')
        .attr('x', (d,i) => d.x)
        .attr("fill", d => d.color)
        .attr('width', d => d.value)
        .attr('opacity', '1')
        .attr('y', (d,i) => d.y)
        .attr('height', d => 6)
  }

  return (
    <Box
      id="distances"
      sx={{
        width: ['90%', '75%', '50%'],
        height: '100%',
        my: ['5'],
        backgroundColor: 'white'
      }}
    ></Box>
  )
}