import { type SchemaProps } from '@/utils/schemas.ts';
import { createVisual } from '@/utils/tools.ts';
import { useApi } from '@/utils/useApi.ts';

type TopologyProps = SchemaProps['topology'];
type EducationProps = SchemaProps['education'];

const renderMap = (
  topologyData: TopologyProps,
  educationData: EducationProps
): void => {
  console.log(topologyData);
  console.log(educationData);
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
