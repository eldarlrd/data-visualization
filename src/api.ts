const SOURCES: Record<string, string> = {
  gdp: 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json',
  doping:
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
};

export const getData = async <T>(source: string): Promise<T> => {
  try {
    const response = await fetch(SOURCES[source], { mode: 'cors' });
    const data = (await response.json()) as T;
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error);
    throw error;
  }
};
