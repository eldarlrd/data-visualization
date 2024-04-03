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

export const App = (): string => `
  <main class='my-4 container row justify-content-center align-items-center column-gap-3'>
    ${PAGES[location.pathname.split('/')[2] as keyof typeof PAGES]}
  </main>
`;
