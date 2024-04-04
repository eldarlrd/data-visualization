import VISUALS from '@/content/visuals.yaml';

interface VisualProps {
  title: string;
  text: string;
}

const Grid = (): string =>
  (VISUALS as VisualProps[])
    .map(
      visual => `
        <figure style='height:14.5rem' class='overflow-y-auto justify-content-between card card-body col-sm-5 col-lg-3'>
          <span>
            <h4 class='card-title'>
              ${visual.title}
            </h4>
            <figcaption class='card-text'>
              ${visual.text}
            </figcaption>
          </span>
          <a
            style='max-width:fit-content'
            class='mt-1 nav-link link-body-emphasis link-offset-2 link-underline-opacity-0 link-underline-opacity-75-hover user-select-none fs-5'
            href=${visual.title.toLowerCase().replaceAll(' ', '-')}>
            Show <i class='fa-solid fa-chevron-right fa-sm'></i>
          </a>
        </figure>
      `
    )
    .join('');

export { type VisualProps, Grid };
