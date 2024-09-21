import { type SchemaProps } from '@/utils/schemas.ts';
import { createVisual } from '@/utils/tools.ts';
import { useApi } from '@/utils/useApi.ts';

type TemperatureProps = SchemaProps['temperature'];

const renderMap = (data: TemperatureProps): void => {
  console.log(data);
};

export const HeatMap = (): string => {
  useApi<TemperatureProps>('temperature')
    .then(data => {
      renderMap(data);
      return;
    })
    .catch((error: unknown) => {
      if (error instanceof Error) console.error(error);
    });

  return createVisual(2, 'heat-map');
};
