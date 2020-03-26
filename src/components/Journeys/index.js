/** @jsx jsx */
import { jsx, Box } from 'theme-ui';
import {useStoreActions} from 'easy-peasy';
import React, {useEffect} from 'react';

import {
  create as d3Create,
  select as d3Select,
  geoAlbers as d3GeoAlbers,
  geoMercator as d3GeoMercator,
  geoPath as d3GeoPath,
} from 'd3';

export default p => {
  const { data } = p;
  let svg;

  const init = () => {
    svg = d3Select("#Journeys")
      .append("svg") //this appends the SVG
      .attr("width", 1000) // add margin here later
      .attr("height",  1000) // add margin here later
      // .append("g")
      // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");const svg = d3Create('svg').attr('viewBox', [0, 0, width, 200]);

    const projectionMercator = d3GeoMercator()
      .center([13.304954,52.620008])
      .scale(75000)
      // .fitExtent([[20, 20], [250, 250]], data.features[0]);

    const path = d3GeoPath(projectionMercator)
    ;

  svg
    .append('g')
    .selectAll('path')
    // Here, "features" is the GeoJSON snippet that we saw earlier
    .data(data.features)
    .enter().append("path")
      .attr("d", path)
      .attr('stroke', 'black')
      .attr('stroke-width', '1px')
      .attr('fill', 'none')
      .attr('opacity', '.25')
    }

  useEffect(() => {
    console.log('inside journey component')
    init();
  }, [data])

  return (
    <Box id="JourneysWrapper" sx={{
      height: ['100vh'],
      width: ['100vw'],
    }} id="Journeys"></Box>
  )
}