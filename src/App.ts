import VISUALIZATIONS from '@/content/visualizations.yaml';

interface VisualizationDetails {
  title: string;
  text: string;
}

export const App = (): string => {
  const VisualizationCards = (VISUALIZATIONS as VisualizationDetails[]).map(
    visualization => `
  <figure style='min-height:11rem;max-height:13rem' class='justify-content-between card card-body col-sm-5 col-lg-3'>
    <span>
      <h4 class='card-title'>
        ${visualization.title}
      </h4>
      <figcaption class='card-text'>
        ${visualization.text}
      </figcaption>
    </span>
    <a
      style='max-width:fit-content'
      class='mt-1 link-body-emphasis link-offset-2 link-underline-opacity-0 link-underline-opacity-75-hover user-select-none fs-5'
      href=${visualization.title.toLowerCase().replaceAll(' ', '-')}>
      Show
    </a>
  </figure>
`
  );

  return `
    <main class='my-4 container row justify-content-center align-items-center column-gap-3'>
      ${VisualizationCards.join('')}
    </main>
  `;
};
