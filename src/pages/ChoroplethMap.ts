import { geoPath, max, min, scaleQuantize, schemeBlues, select } from 'd3';
import { feature, mesh } from 'topojson-client';

import { type SchemaProps } from '@/utils/schemas.ts';
import { createTooltip, createVisual, handleMouseOut } from '@/utils/tools.ts';
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
  const width = 13.5;
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
      <strong>
        ${area_name.toString()}
        <br>
        ${US_STATES[state as keyof typeof US_STATES]}
      </strong>
      – ${bachelorsOrHigher.toString()}%
    `
  );
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
    .attr('stroke', '#f8f9fa')
    .attr('stroke-width', 2)
    .attr('stroke-linejoin', 'round')
    .attr('d', path);
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
