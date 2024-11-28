import { Back } from '@/components/Back.ts';
import { Grid } from '@/features/Grid.ts';
import { NoPage } from '@/features/NoPage.ts';

type PageLoader = () => Promise<string>;
type PageMap = Record<string, PageLoader>;

const PAGE_LIST: PageMap = {
  '': async () => Promise.resolve(Grid()),
  'us-gdp': async () => (await import('@/pages/BarChart.ts')).BarChart(),
  'cycling-doping': async () =>
    (await import('@/pages/ScatterplotGraph.ts')).ScatterplotGraph(),
  'global-temperature': async () =>
    (await import('@/pages/HeatMap.ts')).HeatMap(),
  'us-education': async () =>
    (await import('@/pages/ChoroplethMap.ts')).ChoroplethMap(),
  'movie-sales': async () =>
    (await import('@/pages/TreemapDiagram.ts')).TreemapDiagram()
};

const fallbackLoader: PageLoader = async () => Promise.resolve(NoPage());

export const App = async (): Promise<string> => {
  const currPath = location.pathname.split('/')[2];
  const loadComponent = PAGE_LIST[currPath] ?? fallbackLoader;

  const pageContent = await loadComponent();

  return `
    <main class='my-4 d-flex flex-column align-items-center'>
      <div class='container row justify-content-center align-items-center column-gap-3'>
        ${pageContent}
      </div>
      ${currPath !== '' ? Back() : ''}
    </main>

    <style>
      :root {
        scrollbar-width: thin;
      }

      ::selection {
        color: white;
        background: #0d6efd;
      }

      body {
        font-family: Inter, sans-serif;
      }
    </style>
  `;
};
