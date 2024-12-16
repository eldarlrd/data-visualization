import {
  type HierarchyNode,
  hierarchy,
  scaleOrdinal,
  schemeTableau10,
  select,
  treemap
} from 'd3';

import GLOBALS from '@/content/globals.yaml';
import { type SchemaProps } from '@/utils/schemas.ts';
import { createVisual, type RecordProps } from '@/utils/tools.ts';
import { useApi } from '@/utils/useApi.ts';

type MoviesProps = SchemaProps['movies'];
type MovieLeaf = MoviesProps['children'][number]['children'][number];

interface TreemapNode extends HierarchyNode<MovieLeaf> {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

const renderMap = (data: MoviesProps): void => {
  const width = 720;
  const height = 475;

  const svg = select('#diagram').attr('width', width).attr('height', height);

  const root = hierarchy(data)
    .sum(d => {
      const leafNode = d as unknown as TreemapNode;
      const value = Number(leafNode.value);
      return value;
    })
    .sort((a, b) => Number(b.value) - Number(a.value));

  const treemapLayout = treemap<MoviesProps>()
    .size([width, height])
    .paddingInner(1);

  treemapLayout(root);

  const colorScale = scaleOrdinal(schemeTableau10);

  const nodes = svg
    .selectAll('g')
    .data(root.leaves() as unknown as TreemapNode[])
    .enter()
    .append('g')
    .attr('transform', d => `translate(${d.x0.toString()},${d.y0.toString()})`);

  nodes
    .append('rect')
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .attr('fill', d => colorScale(d.parent?.data.name ?? ''));

  nodes
    .append('text')
    .attr('x', 5)
    .attr('y', 15)
    .text(d => d.data.name)
    .attr('fill', (GLOBALS as { COLORS: RecordProps }).COLORS.white)
    .style('font-size', '10px');
};

export const TreemapDiagram = (): string => {
  useApi<MoviesProps>('movies')
    .then(data => {
      renderMap(data);
      return;
    })
    .catch((error: unknown) => {
      if (error instanceof Error) console.error(error);
    });

  return createVisual(4, 'diagram');
};
