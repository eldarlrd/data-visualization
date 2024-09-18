import {
  axisBottom,
  axisLeft,
  max,
  min,
  scaleBand,
  scaleLinear,
  select
} from 'd3';

import { getData } from '@/api.ts';
import GLOBALS from '@/content/globals.yaml';
import {
  createVisual,
  createTooltip,
  handleMouseOut,
  handleClick,
  type RecordProps
} from '@/utils.ts';

interface DopingAllegation {
  Time: string;
  Place: number;
  Seconds: string;
  Name: string;
  Year: number;
  Nationality: string;
  Doping: string;
  URL: string;
}

const legendData = [
  {
    color: (GLOBALS as { COLORS: RecordProps }).COLORS.darkRed,
    label: 'Doping'
  },
  {
    color: (GLOBALS as { COLORS: RecordProps }).COLORS.darkBlue,
    label: 'No Doping'
  }
];

const createLegend = (): void => {
  const svg = select('#graph');

  const legendGroup = svg.append('g').attr('transform', 'translate(540, 20)');

  legendData.forEach((item, index) => {
    const legendItem = legendGroup
      .append('g')
      .attr('transform', `translate(0, ${(index * 20).toString()})`);

    legendItem
      .append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', item.color);

    legendItem.append('text').attr('x', 22).attr('y', 14).text(item.label);
  });
};

const convertTime = (time: string): number => {
  const [minutes, seconds] = time.split(':').map(Number);
  return minutes + seconds / 60;
};

const formatTime = (time: unknown): string => {
  const minutes = ~~(time as number);
  const seconds = Math.round(((time as number) - minutes) * 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const handleMouseOver = (event: MouseEvent, d: DopingAllegation): void => {
  const remSize = 16;
  const windowPadding = 10;
  const tooltipWidth = remSize * 12;
  createTooltip(tooltipWidth);

  select(event.target as SVGElement).style('fill', d =>
    (d as DopingAllegation).Doping ?
      (GLOBALS as { COLORS: RecordProps }).COLORS.red
    : (GLOBALS as { COLORS: RecordProps }).COLORS.blue
  );

  const mouseX = event.clientX;
  const mouseY = event.clientY;

  const circleWidth = +select(event.target as SVGElement).attr('width');
  const windowWidth = window.innerWidth;

  const tooltipTop = mouseY + circleWidth + windowPadding;
  let tooltipLeft = mouseX + windowPadding;

  if (tooltipLeft + tooltipWidth > windowWidth)
    tooltipLeft = windowWidth - tooltipWidth - windowPadding;

  select('#tooltip')
    .style('display', 'block')
    .html(
      `
      ${(GLOBALS as { FLAGS: RecordProps }).FLAGS[d.Nationality]}
      <strong>
        ${d.Name}
      </strong>
      <br>
        ${d.Time} | ${d.Year.toString()}
      <br>
      <span id='allegation'>
        ${d.Doping}
      </span>
    `
    )
    .style('top', `${tooltipTop.toString()}px`)
    .style('left', `${tooltipLeft.toString()}px`);
};

const renderGraph = (dopingData: DopingAllegation[]): void => {
  const svg = select('#graph')
    .append('g')
    .attr('transform', 'translate(40, 20)');

  svg
    .append('text')
    .attr('id', 'title')
    .attr('x', -240)
    .attr('y', 20)
    .attr('transform', 'rotate(-90)')
    .text('Time in Minutes');

  const sortedYears = dopingData.map(d => d.Year);
  sortedYears.sort((a, b) => a - b);

  const xScale = scaleBand()
    .domain(sortedYears.map(year => year.toString()))
    .range([0, 600])
    .paddingOuter(0.625)
    .paddingInner(1);

  const maxTime = max(dopingData, d => (d.Time ? convertTime(d.Time) : 0)) ?? 0;
  const minTime = min(dopingData, d => (d.Time ? convertTime(d.Time) : 0)) ?? 0;

  const yScale = scaleLinear().domain([maxTime, minTime]).range([350, 0]);

  const tickValues = Array.from(
    { length: Math.ceil(((maxTime - minTime) * 60) / 15) + 1 },
    (_, i) => minTime + (i * 15) / 60
  );

  const xAxis = axisBottom(xScale);
  const yAxis = axisLeft(yScale).tickValues(tickValues).tickFormat(formatTime);

  svg.append('g').attr('transform', `translate(0, 350)`).call(xAxis);
  svg.append('g').call(yAxis);

  svg
    .selectAll('circle')
    .data(dopingData)
    .enter()
    .append('circle')
    .attr('r', 6)
    .attr('cx', d => xScale(d.Year.toString()) ?? 0)
    .attr('cy', d => yScale(convertTime(d.Time)))
    .style('cursor', d => (d.URL ? 'pointer' : 'auto'))
    .style('fill', d =>
      d.Doping ?
        (GLOBALS as { COLORS: RecordProps }).COLORS.darkRed
      : (GLOBALS as { COLORS: RecordProps }).COLORS.darkBlue
    )
    .on('mouseover', handleMouseOver)
    .on('mouseout', (e: MouseEvent, d) => {
      handleMouseOut(e, d.Doping ? 'darkRed' : 'darkBlue');
    })
    .on('click', handleClick);

  createLegend();
};

export const ScatterplotGraph = (): string => {
  getData('doping')
    .then(data => {
      renderGraph(data as DopingAllegation[]);
      return;
    })
    .catch((error: unknown) => {
      if (error instanceof Error) console.error(error);
    });

  return createVisual(1, 'graph');
};
