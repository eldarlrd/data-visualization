import PAGES from '@/content/pages.yaml';
import { type PageProps, titleToLink } from '@/utils.ts';

export const Grid = (): string =>
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
