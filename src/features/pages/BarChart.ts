import { axisBottom, axisLeft, max, scaleBand, scaleLinear, select } from 'd3';

import { getData } from '@/api.ts';

interface GDPShape {
  data: [string, number][];
}

export const BarChart = (): string => {
  getData('gdp')
    .then(data => {
      const gdpData = (data as GDPShape).data;

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

      const handleMouseOver = (
        event: MouseEvent,
        d: [string, number]
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
            .style('width', '7rem')
            .style('user-select', 'none')
            .style('padding', '10px')
            .style('display', 'none');
        }

        select(event.target as SVGElement).attr('fill', '#d1e7dd'); // bs-success-subtle

        const [year, quarter] = d[0].split('-');
        let quarterText = '';

        switch (quarter) {
          case '01':
            quarterText = 'Q1';
            break;
          case '04':
            quarterText = 'Q2';
            break;
          case '07':
            quarterText = 'Q3 ';
            break;
          case '10':
            quarterText = 'Q4';
        }

        const mouseX = event.clientX;

        const barWidth = +select(event.target as SVGElement).attr('width');
        const svgBounds = (svg.node() as SVGElement).getBoundingClientRect();

        const tooltipLeft = mouseX + barWidth + 10;
        let tooltipTop = svgBounds.top + 240;

        if (window.innerWidth < 768) tooltipTop = svgBounds.top + 180;

        if (window.innerWidth < 576) tooltipTop = svgBounds.top + 100;

        tooltip
          .style('display', 'block')
          .html(`${year} ${quarterText}<br>$${d[1].toLocaleString()} B`)
          .attr('data-date', d[0])
          .style('left', `${tooltipLeft.toString()}px`)
          .style('top', `${tooltipTop.toString()}px`);
      };

      const handleMouseOut = (event: MouseEvent): void => {
        select(event.target as SVGElement).attr('fill', '#198754'); // bs-success
        select('#tooltip').style('display', 'none');
      };

      svg
        .selectAll('.bar')
        .data(gdpData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('fill', '#198754') // bs-success
        .attr('data-date', d => d[0])
        .attr('data-gdp', d => d[1])
        .attr('x', d => xScale(d[0]) ?? 0)
        .attr('y', d => yScale(d[1]))
        .attr('width', xScale.bandwidth())
        .attr('height', d => 350 - yScale(d[1]))
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut);

      return;
    })
    .catch((error: unknown) => {
      if (error instanceof Error) console.error(error);
    });

  return `
    <div class='d-flex flex-column justify-content-center align-items-center gap-4 user-select-none'>
      <h3>United States GDP</h3>
      <svg id='chart' width='42rem' height='25rem'></svg>
    </div>

    <style>
      @media (max-width: 48rem) {
        #chart {
          transform: scale(0.8);
        }
      }

      @media (max-width: 36rem) {
        #chart {
          transform: scale(0.5);
        }
      }
    </style>
  `;
};
