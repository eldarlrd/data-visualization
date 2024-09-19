import { type RecordProps } from '@/utils.ts';

const SOURCES: RecordProps = {
  gdp: 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json',
  doping:
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json',
  temperature:
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
};

export const useApi = async <T>(source: string): Promise<T> => {
  try {
    const response = await fetch(SOURCES[source], { mode: 'cors' });
    const data = (await response.json()) as T;
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error);
    throw error;
  }
};
