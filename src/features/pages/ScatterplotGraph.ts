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
import PAGES from '@/content/pages.yaml';
import {
  COLORS,
  type RecordProps,
  type PageProps,
  createTooltip
} from '@/features/Grid.ts';

interface CyclistAllegation {
  Time: string;
  Place: number;
  Seconds: string;
  Name: string;
  Year: number;
  Nationality: string;
  Doping: string;
  URL: string;
}

const convertTime = (time: string): number => {
  const [minutes, seconds] = time.split(':').map(Number);
  return minutes + seconds / 60;
};

const formatTime = (time: unknown): string => {
  const minutes = ~~(time as number);
  const seconds = Math.round(((time as number) - minutes) * 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const handleMouseOver = (event: MouseEvent, d: CyclistAllegation): void => {
  createTooltip('12rem');

  select(event.target as SVGElement).style('fill', d =>
    (d as CyclistAllegation).Doping ? COLORS.danger : COLORS.primary
  );

  const mouseX = event.clientX;
  const mouseY = event.clientY;

  const circleWidth = +select(event.target as SVGElement).attr('width');

  const tooltipLeft = mouseX + circleWidth + 10;
  const tooltipTop = mouseY + circleWidth + 10;

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
      </span>`
    )
    .style('left', `${tooltipLeft.toString()}px`)
    .style('top', `${tooltipTop.toString()}px`);
};

const handleMouseOut = (event: MouseEvent): void => {
  select(event.target as SVGElement).style('fill', d =>
    (d as CyclistAllegation).Doping ? COLORS.dangerSubtle : COLORS.primarySubtle
  );
  select('#tooltip').style('display', 'none');
};

const handleClick = (_: MouseEvent, d: CyclistAllegation): void => {
  if (d.URL && matchMedia('(pointer:fine)').matches)
    window.open(d.URL, '_blank');
};

const createLegend = (): void => {
  const svg = select('#graph');

  const legendData = [
    { color: COLORS.dangerSubtle, label: 'Doping' },
    { color: COLORS.primarySubtle, label: 'No Doping' }
  ];

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

const renderChart = (cyclingData: CyclistAllegation[]): void => {
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

  const sortedYears = cyclingData.map(d => d.Year);
  sortedYears.sort((a, b) => a - b);

  const xScale = scaleBand()
    .domain(sortedYears.map(year => year.toString()))
    .range([0, 600])
    .paddingOuter(0.625)
    .paddingInner(1);

  const maxTime =
    max(cyclingData, d => (d.Time ? convertTime(d.Time) : 0)) ?? 0;
  const minTime =
    min(cyclingData, d => (d.Time ? convertTime(d.Time) : 0)) ?? 0;

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
    .data(cyclingData)
    .enter()
    .append('circle')
    .attr('r', 6)
    .attr('cx', d => xScale(d.Year.toString()) ?? 0)
    .attr('cy', d => yScale(convertTime(d.Time)))
    .style('cursor', d => (d.URL ? 'pointer' : 'auto'))
    .style('fill', d => (d.Doping ? COLORS.dangerSubtle : COLORS.primarySubtle))
    .on('mouseover', handleMouseOver)
    .on('mouseout', handleMouseOut)
    .on('click', handleClick);

  createLegend();
};

export const ScatterplotGraph = (): string => {
  getData('cycling')
    .then(data => {
      renderChart(data as CyclistAllegation[]);
      return;
    })
    .catch((error: unknown) => {
      if (error instanceof Error) console.error(error);
    });

  return `
    <div class='d-flex flex-column justify-content-center align-items-center gap-4 user-select-none'>
      <h3>${(PAGES[1] as PageProps).title.toString()}</h3>
      <svg id='graph' width='42rem' height='25rem'></svg>
    </div>

    <style>
      #allegation {
        color: #b02a37;
      }

      @media (max-width: 48rem) {
        #graph {
          transform: scale(0.8);
        }
      }

      @media (max-width: 36rem) {
        #graph {
          transform: scale(0.5);
        }
      }
    </style>
  `;
};
