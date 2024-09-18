import { axisBottom, axisLeft, max, scaleBand, scaleLinear, select } from 'd3';

import { getData } from '@/api.ts';
import GLOBALS from '@/content/globals.yaml';
import {
  createVisual,
  createTooltip,
  handleMouseOut,
  type RecordProps
} from '@/utils.ts';

interface GDPShape {
  data: [string, number][];
}

const QUARTERS: RecordProps = {
  '01': 'Q1',
  '04': 'Q2',
  '07': 'Q3',
  '10': 'Q4'
};

const handleMouseOver = (event: MouseEvent, d: [string, number]): void => {
  const topDistance = 240;
  const mediumTopDistance = 180;
  const smallTopDistance = 100;

  const mediumScreenSize = 768;
  const smallScreenSize = 576;

  const remSize = 16;
  const windowPadding = 10;
  const tooltipWidth = remSize * 7;
  createTooltip(tooltipWidth);

  select(event.target as SVGElement).style(
    'fill',
    (GLOBALS as { COLORS: RecordProps }).COLORS.lightGreen
  );

  const [year, quarter] = d[0].split('-');
  const quarterText = QUARTERS[quarter];

  const mouseX = event.clientX;

  const barWidth = +select(event.target as SVGElement).attr('width');
  const windowWidth = window.innerWidth;
  const svgBounds = (
    select('#chart').node() as SVGElement
  ).getBoundingClientRect();

  let tooltipTop = svgBounds.top + topDistance;
  let tooltipLeft = mouseX + barWidth + windowPadding;

  if (tooltipLeft + tooltipWidth > windowWidth)
    tooltipLeft = windowWidth - tooltipWidth - windowPadding;

  if (window.innerWidth < mediumScreenSize)
    tooltipTop = svgBounds.top + mediumTopDistance;

  if (window.innerWidth < smallScreenSize)
    tooltipTop = svgBounds.top + smallTopDistance;

  select('#tooltip')
    .style('display', 'block')
    .html(
      `
      <strong>
        ${year} ${quarterText}
      </strong>
      <br>
      $${d[1].toLocaleString()} B
    `
    )
    .attr('data-date', d[0])
    .style('top', `${tooltipTop.toString()}px`)
    .style('left', `${tooltipLeft.toString()}px`);
};

const renderChart = (gdpData: [string, number][]): void => {
  const svg = select('#chart')
    .append('g')
    .attr('transform', 'translate(40, 20)');

  svg
    .append('text')
    .attr('id', 'title')
    .attr('x', -240)
    .attr('y', 20)
    .attr('transform', 'rotate(-90)')
    .text('Gross Domestic Product');

  const years = gdpData.map(([date]) => +date.substring(0, 4));
  const filteredYears = Array.from(
    new Set(years.filter(year => year % 5 === 0))
  );

  const xScale = scaleBand()
    .domain(gdpData.map(([date]) => date))
    .range([0, 600]);

  const xAxis = axisBottom(xScale);
  const xAxisGroup = svg
    .append('g')
    .attr('id', 'x-axis')
    .attr('transform', 'translate(0, 350)');

  xAxisGroup.call(xAxis);
  xAxisGroup
    .selectAll('text')
    .style('text-anchor', 'middle')
    .text((_, i) => (filteredYears.includes(years[i]) ? years[i] : ''))
    .filter((_, i) => i % 4 !== 0)
    .remove();

  xAxisGroup
    .selectAll('.tick')
    .filter((_, i, nodes) => {
      const tick = nodes[i];
      if (!tick || !(tick instanceof Element)) return true;

      const textElement = tick.querySelector('text');
      return textElement === null || textElement.textContent?.trim() === '';
    })
    .remove();

  const yScale = scaleLinear()
    .domain([0, max(gdpData, ([, value]) => value) ?? 0])
    .range([350, 0]);

  const yAxis = axisLeft(yScale).tickFormat(
    d => `$${(+d / 1000).toString()} T`
  );

  svg.append('g').attr('id', 'y-axis').call(yAxis);

  svg
    .selectAll('.bar')
    .data(gdpData)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('fill', (GLOBALS as { COLORS: RecordProps }).COLORS.green)
    .attr('data-date', d => d[0])
    .attr('data-gdp', d => d[1])
    .attr('x', d => xScale(d[0]) ?? 0)
    .attr('y', d => yScale(d[1]))
    .attr('width', xScale.bandwidth())
    .attr('height', d => 350 - yScale(d[1]))
    .on('mouseover', handleMouseOver)
    .on('mouseout', (e: MouseEvent) => {
      handleMouseOut(e, 'green');
    });
};

export const BarChart = (): string => {
  getData('gdp')
    .then(data => {
      renderChart((data as GDPShape).data);
      return;
    })
    .catch((error: unknown) => {
      if (error instanceof Error) console.error(error);
    });

  return createVisual(0, 'chart');
};
