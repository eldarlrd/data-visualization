import {
  axisBottom,
  axisLeft,
  extent,
  interpolateRdYlBu,
  scaleBand,
  scaleSequential,
  select
} from 'd3';

import { type SchemaProps } from '@/utils/schemas.ts';
import { createTooltip, createVisual, handleMouseOut } from '@/utils/tools.ts';
import { useApi } from '@/utils/useApi.ts';

const MONTHS = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC'
];

const MONTHS_FULL = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

type TemperatureProps = SchemaProps['temperature'];

const handleMouseOver = (
  e: MouseEvent,
  d: TemperatureProps['monthlyVariance'][number],
  baseTemperature: number
): void => {
  const width = 10.5;
  const posY = e.clientY;

  const varianceFormatted =
    d.variance > 0 ? `+${d.variance.toFixed(2)}` : d.variance.toFixed(2);

  createTooltip({
    e,
    posY,
    width
  });

  select('#tooltip').html(
    `
      <strong class='fw-medium'>
        ${d.year.toString()} ${MONTHS_FULL[d.month - 1]} 
      </strong>
      <br>
      ${(baseTemperature + d.variance).toFixed(2)} °C | ${varianceFormatted} °C
    `
  );
};

const renderMap = (data: TemperatureProps): void => {
  const { baseTemperature, monthlyVariance } = data;

  const margin = { top: 0, right: 60, bottom: 20, left: 80 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = select('#heat-map')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr(
      'transform',
      `translate(${margin.left.toString()}, ${margin.top.toString()})`
    );

  const years = [...new Set(monthlyVariance.map(d => d.year.toString()))];

  const xScale = scaleBand().range([0, width]).domain(years);

  const yScale = scaleBand().range([0, height]).domain(MONTHS);

  const varianceExtent = extent(
    monthlyVariance,
    d => baseTemperature + d.variance
  );

  const minVariance = varianceExtent[0] ?? 0;
  const maxVariance = varianceExtent[1] ?? 0;

  const colorScale = scaleSequential()
    .interpolator(interpolateRdYlBu)
    .domain([maxVariance, minVariance]);

  svg
    .selectAll()
    .data(monthlyVariance)
    .enter()
    .append('rect')
    .attr('x', d => xScale(d.year.toString()) ?? 0)
    .attr('y', d => yScale(MONTHS[d.month - 1]) ?? 0)
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
    .style('fill', d => colorScale(baseTemperature + d.variance))
    .on('mouseover', (e: MouseEvent, d) => {
      handleMouseOver(e, d, baseTemperature);
    })
    .on('mouseout', (e: MouseEvent, d) => {
      handleMouseOut(e, colorScale(baseTemperature + d.variance), true);
    });

  const decades = years.filter(year => +year % 10 === 0);

  svg
    .append('g')
    .attr('transform', `translate(0, ${height.toString()})`)
    .call(axisBottom(xScale).tickValues(decades));

  svg.append('g').call(axisLeft(yScale));
};

export const HeatMap = (): string => {
  useApi<TemperatureProps>('temperature')
    .then(data => {
      renderMap(data);
      return;
    })
    .catch((error: unknown) => {
      if (error instanceof Error) console.error(error);
    });

  return createVisual(2, 'heat-map');
};
