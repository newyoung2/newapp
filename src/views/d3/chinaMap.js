import * as d3 from 'd3';

export default function mapEasy(id, data) {
  const width = 800;
  const height = 800;
  // 画布
  const svg = d3
    .select(id)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

//敲黑板：投影方式。
  const projection = d3
    .geoMercator()
    .center([107, 31])
    .scale(600)
    .translate([width / 2, height / 2]);

  const path = d3.geoPath(projection)

  const color = d3.schemeCategory10;

  svg
    .selectAll('g')
    .data(data.features)
    .enter()
    .append('g')
    .append('path')
    .attr('d', path)
    .attr('stroke', '#000')
    .attr('stroke-width', 1)
    .attr('opacity', 0.6)
    .attr('fill', function(d, i) {
      return color[i % 10];
    })
    // .on('mouseover', function() {
    //   d3.select(this).attr('opacity', 1);
    // })
    // .on('mouseout', function() {
    //   d3.select(this).attr('opacity', 0.6);
    // });
  // 添加坐标
  svg
    .selectAll('g')
    .append('text')
    .attr('font-size', 12)
    .attr('text-anchor', 'middle')
    .attr('x', d => {
      const position = projection(d.properties.centroid || [0, 0]);
      return position[0];
    })
    .attr('y', d => {
      const position = projection(d.properties.centroid || [0, 0]);
      return position[1];
    })
    .attr('dy', d => {
    //这里为什么这么写呢，因为澳门和香港重合了，挤到一起了。
      if (d.properties.name === '澳门') {
        return 15;
      }
    })
    .text(d => d.properties.name);
}

