import { axisBottom, axisLeft, max, scaleBand, scaleLinear, select } from 'd3';

export const BarChart = (): string => {
  fetch(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
  )
    .then(response => response.json())
    .then((data: { data: [string, number][] }) => {
      const gdpData = data.data;

      const svg = select('#chart');

      svg
        .append('text')
        .attr('id', 'title')
        .attr('x', -240)
        .attr('y', 20)
        .attr('transform', 'rotate(-90)')
        .style('user-select', 'none')
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
          if (!tick || !(tick instanceof Element)) return true; // Handle the case where tick is null or not an Element
          const textElement = tick.querySelector('text');
          return textElement === null || textElement.textContent?.trim() === '';
        })
        .style('display', 'none');

      const yScale = scaleLinear()
        .domain([0, max(gdpData, ([, value]) => value) ?? 0])
        .range([350, 0]);

      const yAxis = axisLeft(yScale);
      svg.append('g').attr('id', 'y-axis').call(yAxis);

      const handleMouseOver = (
        event: MouseEvent,
        d: [string, number]
      ): void => {
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
        select('#tooltip')
          .style('display', 'block')
          .html(`${year} ${quarterText}<br>$${d[1].toLocaleString()} B`)
          .attr('data-date', d[0])
          .style('left', event.pageX.toString() + 'px')
          .style('top', (event.pageY - 50).toString() + 'px');
      };

      const handleMouseOut = (): void => {
        select('#tooltip').style('display', 'none');
      };

      svg
        .selectAll('.bar')
        .data(gdpData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('fill', '#198754') // bootstrap-success
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
    <div class='d-flex flex-column justify-content-center align-items-center'>
      <svg id='chart' width='50%' height='400'></svg>
      <div id='tooltip'></div>
    </div>
  `;
};
