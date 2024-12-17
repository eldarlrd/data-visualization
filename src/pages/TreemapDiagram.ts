import {
  type HierarchyNode,
  type Selection,
  hierarchy,
  scaleOrdinal,
  schemeTableau10,
  select,
  treemap
} from 'd3';

import GLOBALS from '@/content/globals.yaml';
import { type SchemaProps } from '@/utils/schemas.ts';
import {
  createTooltip,
  createVisual,
  handleMouseOut,
  type RecordProps
} from '@/utils/tools.ts';
import { useApi } from '@/utils/useApi.ts';

type MoviesProps = SchemaProps['movies'];
type MovieLeaf = MoviesProps['children'][number]['children'][number];

interface TreemapNode extends HierarchyNode<MovieLeaf> {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

const handleMouseOver = (e: MouseEvent, d: TreemapNode): void => {
  const width = 13.5;
  const posY = e.clientY;

  createTooltip({
    e,
    posY,
    width
  });

  select('#tooltip').html(
    `
      <strong class='fw-medium'>
        ${d.data.name}
        <br>
        ${d.parent?.data.name ?? 'Unknown'}
      </strong>
      - $${(+d.data.value).toLocaleString()}
    `
  );
};

const wrapText = (
  text: Selection<SVGTextElement, unknown, null, undefined>,
  rectWidth: number,
  rectHeight: number
): void => {
  const words = text.text().split(/\s+/).reverse();
  let word;
  let line: string[] = [];
  let lineNumber = 0;
  const lineHeight = 1.1;

  const x = +text.attr('x');
  const y = +text.attr('y');
  let tspan = text.text(null).append('tspan').attr('x', x).attr('y', y);

  while ((word = words.pop())) {
    line.push(word);
    tspan.text(line.join(' '));

    const textLength = tspan.node()?.getComputedTextLength() ?? 0;
    if (textLength > rectWidth && line.length > 1) {
      line.pop();
      tspan.text(line.join(' '));
      line = [word];
      tspan = text
        .append('tspan')
        .attr('x', x)
        .attr('y', y + ++lineNumber * lineHeight * 10)
        .text(word);
    }
  }

  const textHeight = text.node()?.getBBox().height ?? 0;
  if (textHeight > rectHeight) text.attr('y', rectHeight / 2 - textHeight / 2);
};

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
    .attr('fill', d => colorScale(d.parent?.data.name ?? ''))
    .on('mouseover', (e: MouseEvent, d: TreemapNode) => {
      handleMouseOver(e, d);
    })
    .on('mouseout', function (e: MouseEvent) {
      const currentColor = select(this).style('fill');
      handleMouseOut(e, currentColor);
    });

  nodes
    .append('text')
    .attr('x', 5)
    .attr('y', 15)
    .text(d => d.data.name)
    .attr('fill', (GLOBALS as { COLORS: RecordProps }).COLORS.white)
    .style('font-size', '10px')
    .classed('fw-medium', true)
    .classed('pe-none', true)
    .each(function (d) {
      const node = select(this);
      wrapText(node, d.x1 - d.x0, d.y1 - d.y0);
    });
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
