import { select } from 'd3';

import GLOBALS from '@/content/globals.yaml';
import PAGES from '@/content/pages.yaml';

interface LegendProps {
  color: string;
  label: string;
}

interface PageProps {
  title: string;
  text: string;
}

type RecordProps = Record<string, string>;

const createVisual = (index: number, visual: string): string => `
  <div class='d-flex flex-column justify-content-center align-items-center gap-4 user-select-none'>
    <h3>${(PAGES[index] as PageProps).title.toString()}</h3>
    <svg id=${visual} class='visual' width='42rem' height='25rem'></svg>
  </div>

  <style>
    #allegation {
      color: ${(GLOBALS as { COLORS: RecordProps }).COLORS.darkRed};
    }

    @media (max-width: 48rem) {
      .visual {
        transform: scale(0.8);
      }
    }

    @media (max-width: 36rem) {
      .visual {
        transform: scale(0.5);
      }
    }
  </style>
`;

const createTooltip = (width: number): void => {
  let tooltip = select<HTMLDivElement, unknown>('#tooltip');
  if (tooltip.empty()) {
    tooltip = select('body')
      .append('div')
      .attr('id', 'tooltip')
      .style('position', 'absolute')
      .style(
        'background-color',
        (GLOBALS as { COLORS: RecordProps }).COLORS.white
      )
      .style(
        'border',
        `1px solid ${(GLOBALS as { COLORS: RecordProps }).COLORS.gray}`
      )
      .style('width', width.toString() + 'px')
      .style('border-radius', '.375rem')
      .style('user-select', 'none')
      .style('opacity', '0.975')
      .style('padding', '10px')
      .style('display', 'none');
  }
};

const createLegend = (legendData: LegendProps[]): void => {
  const svg = select('#data');

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

const handleMouseOut = (event: MouseEvent, fillColor: string): void => {
  select(event.target as SVGElement).style(
    'fill',
    (GLOBALS as { COLORS: RecordProps }).COLORS[fillColor]
  );
  select('#tooltip').style('display', 'none');
};

const handleClick = (_: MouseEvent, d: { URL: string }): void => {
  if (d.URL && matchMedia('(pointer:fine)').matches)
    window.open(d.URL, '_blank');
};

const titleToLink = (title: string): string =>
  title.split(' ').slice(1).join('-').toLowerCase();

export {
  createVisual,
  createTooltip,
  createLegend,
  handleMouseOut,
  handleClick,
  titleToLink,
  type PageProps,
  type RecordProps
};