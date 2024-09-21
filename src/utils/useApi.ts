import { ZodError } from 'zod';

import { SCHEMAS } from '@/utils/schemas.ts';
import { loadContent, type RecordProps } from '@/utils/tools.ts';

const SOURCES: RecordProps = {
  gdp: 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json',
  doping:
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json',
  temperature:
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
};

const useApi = async <T>(source: keyof typeof SCHEMAS): Promise<T> => {
  try {
    const response = await fetch(SOURCES[source]);
    const data = (await response.json()) as T;

    const parsedData = SCHEMAS[source].parse(data) as T;

    loadContent();
    return parsedData;
  } catch (error: unknown) {
    if (error instanceof ZodError) console.error(error);
    if (error instanceof Error) console.error(error);
    throw error;
  }
};

export { SOURCES, useApi };
