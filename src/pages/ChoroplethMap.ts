import {
  axisBottom,
  geoPath,
  max,
  min,
  scaleLinear,
  type ScaleQuantize,
  scaleQuantize,
  schemeBlues,
  select,
  type Selection
} from 'd3';
import { feature, mesh } from 'topojson-client';

import GLOBALS from '@/content/globals.yaml';
import { type SchemaProps } from '@/utils/schemas.ts';
import {
  createTooltip,
  createVisual,
  handleMouseOut,
  type RecordProps
} from '@/utils/tools.ts';
import { useApi } from '@/utils/useApi.ts';

type TopologyProps = SchemaProps['topology'];
type EducationProps = SchemaProps['education'];

const US_STATES = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming'
};

const handleMouseOver = (
  e: MouseEvent,
  d: GeoJSON.Feature,
  educationMap: Map<number, EducationProps[number]>
): void => {
  const width = 13;
  const fillColor = 'black';
  const posY = e.clientY;

  const {
    bachelorsOrHigher = 0,
    area_name = '',
    state = ''
  } = educationMap.get(Number(d.id)) ?? {};

  createTooltip({
    e,
    posY,
    width,
    fillColor
  });

  select('#tooltip').html(
    `
      <strong class='fw-medium'>
        ${area_name.toString()}
        <br>
        ${US_STATES[state as keyof typeof US_STATES]}
      </strong>
      – ${bachelorsOrHigher.toString()}%
    `
  );
};

const renderLegend = (
  svg: Selection<SVGSVGElement, unknown, null, undefined>,
  colorScale: ScaleQuantize<string>,
  minRate: number,
  maxRate: number
): void => {
  const legendWidth = 300;
  const legendHeight = 15;
  const legendX = '560';
  const legendY = '30';

  const legendGroup = svg
    .append('g')
    .attr('transform', `translate(${legendX},${legendY})`);

  const legendScale = scaleLinear()
    .domain([minRate, maxRate])
    .range([0, legendWidth]);

  const tickValues = [minRate, ...colorScale.thresholds(), maxRate];

  legendGroup
    .selectAll('rect')
    .data(colorScale.range().map(d => colorScale.invertExtent(d)))
    .enter()
    .append('rect')
    .attr('x', d => legendScale(d[0]))
    .attr('y', 0)
    .attr('width', d => legendScale(d[1]) - legendScale(d[0]))
    .attr('height', legendHeight)
    .attr('fill', d => colorScale(d[0]));

  legendGroup
    .append('g')
    .call(
      axisBottom(legendScale)
        .tickSize(25)
        .tickValues(tickValues)
        .tickFormat(d => `${Math.round(+d).toString()}%`)
    )
    .select('.domain')
    .remove();
};

const renderMap = (
  topologyData: TopologyProps,
  educationData: EducationProps
): void => {
  const minRate = min(educationData.map(d => d.bachelorsOrHigher)) ?? 0;
  const maxRate = max(educationData.map(d => d.bachelorsOrHigher)) ?? 0;

  const color = scaleQuantize([minRate, maxRate], schemeBlues[9]);
  const counties = feature(
    topologyData as unknown as TopoJSON.Topology,
    topologyData.objects.counties as TopoJSON.GeometryObject
  );
  const educationMap = new Map(
    educationData.map(d => [
      d.fips,
      {
        fips: d.fips,
        bachelorsOrHigher: d.bachelorsOrHigher,
        area_name: d.area_name,
        state: d.state
      }
    ])
  );

  const countyFeatures = 'features' in counties ? counties.features : [];

  const path = geoPath();

  const svg = select('#choropleth-map')
    .append('svg')
    .attr('viewBox', '0 0 900 600');

  svg // Counties
    .append('g')
    .selectAll('path')
    .data(countyFeatures)
    .enter()
    .append('path')
    .attr('fill', d =>
      color(Number(educationMap.get(Number(d.id))?.bachelorsOrHigher))
    )
    .attr('d', path)
    .on('mouseover', (e: MouseEvent, d) => {
      handleMouseOver(e, d, educationMap);
    })
    .on('mouseout', (e: MouseEvent, d) => {
      handleMouseOut(
        e,
        color(Number(educationMap.get(Number(d.id))?.bachelorsOrHigher))
      );
    });

  svg // States
    .append('path')
    .datum(
      mesh(
        topologyData as unknown as TopoJSON.Topology,
        topologyData.objects.states,
        (a, b) => a !== b
      )
    )
    .attr('fill', 'none')
    .attr('stroke', (GLOBALS as { COLORS: RecordProps }).COLORS.white)
    .attr('stroke-width', 2)
    .attr('stroke-linejoin', 'round')
    .attr('d', path);

  renderLegend(
    svg as unknown as Selection<SVGSVGElement, unknown, null, undefined>,
    color,
    minRate,
    maxRate
  );
};

export const ChoroplethMap = (): string => {
  Promise.all([
    useApi<TopologyProps>('topology'),
    useApi<EducationProps>('education')
  ])
    .then(([topologyData, educationData]) => {
      renderMap(topologyData, educationData);
      return;
    })
    .catch((error: unknown) => {
      if (error instanceof Error) console.error(error);
    });

  return createVisual(3, 'choropleth-map');
};
