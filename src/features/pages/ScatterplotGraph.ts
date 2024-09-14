import {
  axisBottom,
  axisLeft,
  max,
  min,
  scaleBand,
  scaleLinear,
  select
} from 'd3';

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
        .attr('x', -240)
        .attr('y', 20)
        .attr('transform', 'rotate(-90)')
        .text('Time in Minutes');

      const xScale = scaleBand()
        .domain(cyclingData.map(d => d.Year.toString()))
        .range([0, 600]);

      const maxTime =
        max(cyclingData, d => (d.Time ? convertTime(d.Time) : 0)) ?? 0;
      const minTime =
        min(cyclingData, d => (d.Time ? convertTime(d.Time) : 0)) ?? 0;

      const yScale = scaleLinear().domain([maxTime, minTime]).range([350, 0]);

      svg
        .append('g')
        .call(axisBottom(xScale))
        .attr('transform', `translate(0, 350)`);

      svg.append('g').call(axisLeft(yScale));

      svg
        .selectAll('circle')
        .data(cyclingData)
        .enter()
        .append('circle')
        .attr('r', 6)
        .attr('cx', d => xScale(d.Year.toString()) ?? 0)
        .attr('cy', d => yScale(convertTime(d.Time)))
        .style('fill', '#dc3545'); // bootstrap-danger;

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
