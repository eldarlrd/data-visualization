import { Back } from '@/components/Back.ts';
import PAGES from '@/content/pages.yaml';
import { Grid, titleToLink, type PageProps } from '@/features/Grid.ts';
import { BarChart } from '@/features/pages/BarChart.ts';
import { ChoroplethMap } from '@/features/pages/ChoroplethMap.ts';
import { HeatMap } from '@/features/pages/HeatMap.ts';
import { ScatterplotGraph } from '@/features/pages/ScatterplotGraph.ts';
import { TreemapDiagram } from '@/features/pages/TreemapDiagram.ts';

const PAGE_LIST = {
  '': Grid()
};

const TOOLS = [
  BarChart(),
  ScatterplotGraph(),
  HeatMap(),
  ChoroplethMap(),
  TreemapDiagram()
];

const links = (PAGES as PageProps[]).map(page => titleToLink(page.title));

links.forEach((link, index) => {
  PAGE_LIST[link as keyof typeof PAGE_LIST] = TOOLS[index];
});

export const App = (): string => {
  const currPath = location.pathname.split('/')[2];

  return `
    <main class='my-4 d-flex flex-column align-items-center'>
      <div class='container row justify-content-center align-items-center column-gap-3'>
        ${PAGE_LIST[currPath as keyof typeof PAGE_LIST] || Back()}
      </div>
      ${currPath && currPath in PAGE_LIST ? Back() : ''}
    </main>
  `;
};
