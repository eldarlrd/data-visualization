import { Back } from '@/components/Back.ts';
import VISUALS from '@/content/visuals.yaml';
import { Grid, type VisualProps } from '@/features/Grid.ts';
import { BarChart } from '@/features/pages/BarChart.ts';
import { ChoroplethMap } from '@/features/pages/ChoroplethMap.ts';
import { HeatMap } from '@/features/pages/HeatMap.ts';
import { ScatterplotGraph } from '@/features/pages/ScatterplotGraph.ts';
import { TreemapDiagram } from '@/features/pages/TreemapDiagram.ts';

const PAGES = {
  '': Grid()
};

const TOOLS = [
  BarChart(),
  ScatterplotGraph(),
  HeatMap(),
  ChoroplethMap(),
  TreemapDiagram()
];

const links = (VISUALS as VisualProps[]).map(visual =>
  visual.title.toLowerCase().replaceAll(' ', '-')
);

links.forEach((link, index) => {
  PAGES[link as keyof typeof PAGES] = TOOLS[index];
});

export const App = (): string => {
  const currPath = location.pathname.split('/')[2];

  return `
    <main class='my-4 d-flex flex-column align-items-center'>
      <div class='container row justify-content-center align-items-center column-gap-3'>
        ${PAGES[currPath as keyof typeof PAGES] || Back()}
      </div>
      ${currPath && currPath in PAGES ? Back() : ''}
    </main>
  `;
};
