import { type SchemaProps } from '@/utils/schemas.ts';
import { createVisual } from '@/utils/tools.ts';
import { useApi } from '@/utils/useApi.ts';

type MoviesProps = SchemaProps['movies'];

const renderMap = (data: MoviesProps): void => {
  console.log(data);
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
