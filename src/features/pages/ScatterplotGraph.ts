import {
  axisBottom,
  axisLeft,
  max,
  min,
  scaleBand,
  scaleLinear,
  select
} from 'd3';

import COUNTRY_FLAGS from '@/content/flags.yaml';

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

export const ScatterplotGraph = (): string => {
  fetch(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
  )
    .then(response => response.json())
    .then((data: CyclistAllegation[]) => {
      const cyclingData = data;

      const svg = select('#graph')
        .append('g')
        .attr('transform', 'translate(40, 20)');

      svg
        .append('text')
        .attr('id', 'title')
        .attr('x', -230)
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
      const yAxis = axisLeft(yScale)
        .tickValues(tickValues)
        .tickFormat(formatTime);

      svg.append('g').attr('transform', `translate(0, 350)`).call(xAxis);
      svg.append('g').call(yAxis);

      const handleMouseOver = (
        event: MouseEvent,
        d: CyclistAllegation
      ): void => {
        let tooltip = select<HTMLDivElement, unknown>('#tooltip');
        if (tooltip.empty()) {
          tooltip = select('body')
            .append('div')
            .attr('id', 'tooltip')
            .style('position', 'absolute')
            .style('background-color', '#f8f9fa') // bs-light
            .style('border', '1px solid #6c757d') // bs-secondary
            .style('border-radius', '.375rem')
            .style('width', '12rem')
            .style('user-select', 'none')
            .style('padding', '10px')
            .style('display', 'none');
        }

        select(event.target as SVGElement).style(
          'fill',
          d => ((d as CyclistAllegation).Doping ? '#dc3545' : '#0d6efd') // bs-danger & bs-primary
        );

        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const circleWidth = +select(event.target as SVGElement).attr('width');

        const tooltipLeft = mouseX + circleWidth + 10;
        const tooltipTop = mouseY + circleWidth + 10;

        tooltip
          .style('display', 'block')
          .html(
            `${COUNTRY_FLAGS[d.Nationality] as string} ${d.Name}<br>${d.Time} | ${d.Year.toString()}<br><span id='allegation'>${d.Doping}</span>`
          )
          .style('left', `${tooltipLeft.toString()}px`)
          .style('top', `${tooltipTop.toString()}px`);
      };

      const handleMouseOut = (event: MouseEvent): void => {
        select(event.target as SVGElement).style(
          'fill',
          d => ((d as CyclistAllegation).Doping ? '#b02a37' : '#0a58ca') // bs-danger-subtle & bs-primary-subtle
        );
        select('#tooltip').style('display', 'none');
      };

      svg
        .selectAll('circle')
        .data(cyclingData)
        .enter()
        .append('circle')
        .attr('r', 6)
        .attr('cx', d => xScale(d.Year.toString()) ?? 0)
        .attr('cy', d => yScale(convertTime(d.Time)))
        .style('fill', d => (d.Doping ? '#b02a37' : '#0a58ca')) // bs-danger-subtle & bs-primary-subtle
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut);

      return;
    })
    .catch((error: unknown) => {
      if (error instanceof Error) console.error(error);
    });

  return `
    <div class='d-flex flex-column justify-content-center align-items-center gap-4 user-select-none'>
      <h3>Doping in Bicycle Racing</h3>
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
