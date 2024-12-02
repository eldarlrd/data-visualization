import { select } from 'd3';

import { Spinner } from '@/components/Spinner.ts';
import GLOBALS from '@/content/globals.yaml';
import PAGES from '@/content/pages.yaml';

interface TooltipProps {
  e: MouseEvent;
  posX?: number;
  posY: number;
  width: number;
  fillColor: string;
}

interface PageProps {
  title: string;
  text: string;
}

type RecordProps = Record<string, string>;

const loadContent = (): void => {
  select('#spinner-slot').classed('d-none', true);
  select('.visual').style('display', 'block');
};

const createVisual = (index: number, visual: string): string => `
  <div class='d-flex flex-column justify-content-center align-items-center gap-4 user-select-none'>
    <h3>
      ${(PAGES[index] as PageProps).title.toString()}
    </h3>

    <div id='spinner-slot'>
      ${Spinner()}
    </div>

    <svg id='${visual}' class='visual' width='42rem' height='25rem' style='display:none'></svg>
  </div>

  <style>
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

const controlTooltip = ({
  e,
  posX = e.clientX,
  posY,
  width,
  fillColor
}: TooltipProps): void => {
  const windowWidth = window.innerWidth;
  const windowPadding = 10;
  posX += windowPadding;
  posY += windowPadding;

  // Prevent window overflow
  if (posX + width > windowWidth) posX = windowWidth - width - windowPadding;

  select(e.target as SVGElement).style(
    'fill',
    (GLOBALS as { COLORS: RecordProps }).COLORS[fillColor]
  );

  select('#tooltip')
    .style('display', 'block')
    .style('top', `${posY.toString()}px`)
    .style('left', `${posX.toString()}px`);
};

const createTooltip = ({
  e,
  posX,
  posY,
  width,
  fillColor
}: TooltipProps): void => {
  const remSize = 16;
  width = width * remSize;

  let tooltip = select<HTMLDivElement, unknown>('#tooltip');
  if (tooltip.empty()) {
    tooltip = select('body')
      .append('div')
      .attr('id', 'tooltip')
      .classed('pe-none', true)
      .classed('user-select-none', true)
      .classed('position-absolute', true)
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
      .style('opacity', '0.975')
      .style('padding', '10px')
      .style('display', 'none');
  }

  controlTooltip({ e, posX, posY, width, fillColor });
};

const handleMouseOut = (
  event: MouseEvent,
  fillColor: string,
  custom = false
): void => {
  select(event.target as SVGElement).style(
    'fill',
    custom ? fillColor : (GLOBALS as { COLORS: RecordProps }).COLORS[fillColor]
  );
  select('#tooltip').style('display', 'none');
};

const handleClick = (_: MouseEvent, d: { URL: string | null }): void => {
  // Disable links on a touchscreen
  if (d.URL && matchMedia('(pointer:fine)').matches)
    window.open(d.URL, '_blank', 'noreferrer');
};

const titleToLink = (title: string): string =>
  title.split(' ').slice(1).join('-').toLowerCase();

export {
  loadContent,
  createVisual,
  createTooltip,
  handleMouseOut,
  handleClick,
  titleToLink,
  type PageProps,
  type RecordProps
};
