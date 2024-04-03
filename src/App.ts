import VISUALS from '@/content/visuals.yaml';

interface VisualProps {
  title: string;
  text: string;
}

const VisualCards = (VISUALS as VisualProps[]).map(
  visual => `
    <figure style='min-height:11rem;max-height:13rem' class='justify-content-between card card-body col-sm-5 col-lg-3'>
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
        class='mt-1 link-body-emphasis link-offset-2 link-underline-opacity-0 link-underline-opacity-75-hover user-select-none fs-5'
        href=${visual.title.toLowerCase().replaceAll(' ', '-')}>
        Show
      </a>
    </figure>
  `
);

export const App = (): string => {
  return `
    <main class='my-4 container row justify-content-center align-items-center column-gap-3'>
      ${VisualCards.join('')}
    </main>
  `;
};
