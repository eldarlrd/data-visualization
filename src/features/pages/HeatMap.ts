import { getData } from '@/api.ts';
import { createVisual } from '@/utils.ts';

interface VarianceProps {
  year: number;
  month: number;
  variance: number;
}

interface TemperatureProps {
  baseTemperature: number;
  monthlyVariance: VarianceProps[];
}

const renderMap = (data: TemperatureProps): void => {
  console.log(data);
};

export const HeatMap = (): string => {
  getData('temperature')
    .then(data => {
      renderMap(data as TemperatureProps);
      return;
    })
    .catch((error: unknown) => {
      if (error instanceof Error) console.error(error);
    });

  return createVisual(2, 'heat-map');
};
