import { axisBottom, axisLeft, max, scaleBand, scaleLinear, select } from 'd3';

import GLOBALS from '@/content/globals.yaml';
import { type SchemaProps } from '@/utils/schemas.ts';
import {
  createVisual,
  createTooltip,
  handleMouseOut,
  type RecordProps
} from '@/utils/tools.ts';
import { useApi } from '@/utils/useApi.ts';

type GDPShape = SchemaProps['gdp'];

const QUARTERS: RecordProps = {
  '01': 'Q1',
  '04': 'Q2',
  '07': 'Q3',
  '10': 'Q4'
};

const handleMouseOver = (e: MouseEvent, d: GDPShape['data'][number]): void => {
  const width = 7.5;
  const fillColor = 'lightGreen';
  const posY = e.clientY;

  const [year, quarter] = d[0].split('-');
  const quarterText = QUARTERS[quarter];

  createTooltip({ e, posY, width, fillColor });

  select('#tooltip')
    .html(
      `
        <strong class='fw-medium'>
          ${year} ${quarterText}
        </strong>
        <br>
        $${d[1].toLocaleString()} B
      `
    )
    .attr('data-date', d[0]);
};

const renderChart = (gdpData: GDPShape['data']): void => {
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
  useApi<GDPShape>('gdp')
    .then(data => {
      renderChart(data.data);
      return;
    })
    .catch((error: unknown) => {
      if (error instanceof Error) console.error(error);
    });

  return createVisual(0, 'chart');
};
