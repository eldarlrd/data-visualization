import { Back } from '@/components/Back.ts';
import { Grid } from '@/features/Grid.ts';

type PageLoader = () => Promise<string>;
type PageMap = Record<string, PageLoader>;

const PAGE_LIST: PageMap = {
  '': async () => Promise.resolve(Grid()),
  'us-gdp': async () =>
    (await import('@/features/pages/BarChart.ts')).BarChart(),
  'cycling-doping': async () =>
    (await import('@/features/pages/ScatterplotGraph.ts')).ScatterplotGraph(),
  'global-temperature': async () =>
    (await import('@/features/pages/HeatMap.ts')).HeatMap(),
  'us-education': async () =>
    (await import('@/features/pages/ChoroplethMap.ts')).ChoroplethMap(),
  'movie-sales': async () =>
    (await import('@/features/pages/TreemapDiagram.ts')).TreemapDiagram()
};

const fallbackLoader: PageLoader = async () => Promise.resolve(Back());

export const App = async (): Promise<string> => {
  const currPath = location.pathname.split('/')[2];
  const loadComponent = PAGE_LIST[currPath] ?? fallbackLoader;

  const pageContent = await loadComponent();

  return `
    <main class='my-4 d-flex flex-column align-items-center'>
      <div class='container row justify-content-center align-items-center column-gap-3'>
        ${pageContent}
      </div>
      ${currPath && currPath in PAGE_LIST ? Back() : ''}
    </main>
  `;
};
