import { select } from 'd3';

import PAGES from '@/content/pages.yaml';

interface PageProps {
  title: string;
  text: string;
}

type RecordProps = Record<string, string>;

const COLORS: RecordProps = {
  light: '#f8f9fa',
  primary: '#0d6efd',
  primarySubtle: '#0a58ca',
  secondary: '#6c757d',
  success: '#198754',
  successSubtle: '#d1e7dd',
  danger: '#dc3545',
  dangerSubtle: '#b02a37'
};

const createTooltip = (width: string): void => {
  let tooltip = select<HTMLDivElement, unknown>('#tooltip');
  if (tooltip.empty()) {
    tooltip = select('body')
      .append('div')
      .attr('id', 'tooltip')
      .style('position', 'absolute')
      .style('background-color', COLORS.light)
      .style('border', `1px solid ${COLORS.secondary}`)
      .style('border-radius', '.375rem')
      .style('width', width)
      .style('user-select', 'none')
      .style('padding', '10px')
      .style('opacity', '0.975')
      .style('display', 'none');
  }
};

const titleToLink = (title: string): string =>
  title.split(' ').slice(1).join('-').toLowerCase();

const Grid = (): string =>
  (PAGES as PageProps[])
    .map(
      page => `
        <figure style='height:14.5rem' class='overflow-y-auto justify-content-between card card-body col-sm-5 col-lg-3'>
          <span>
            <h4 class='card-title'>
              ${page.title}
            </h4>
            <figcaption class='card-text'>
              ${page.text}
            </figcaption>
          </span>
          <a
            style='max-width:fit-content'
            class='mt-1 nav-link link-body-emphasis link-offset-2 link-underline-opacity-0 link-underline-opacity-75-hover user-select-none fs-5'
            href=${titleToLink(page.title)}>
            Show <i class='fa-solid fa-chevron-right fa-sm'></i>
          </a>
        </figure>
      `
    )
    .join('');

export {
  COLORS,
  Grid,
  createTooltip,
  titleToLink,
  type PageProps,
  type RecordProps
};
