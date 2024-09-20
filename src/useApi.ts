import {
  object,
  tuple,
  string,
  number,
  ZodError,
  type z,
  type ZodSchema
} from 'zod';

import { type RecordProps } from '@/utils.ts';

interface SchemaProps {
  gdp: z.infer<typeof gdpSchema>;
  doping: z.infer<typeof dopingSchema>;
  temperature: z.infer<typeof temperatureSchema>;
}

const gdpSchema = object({
  data: tuple([string(), number()]).array()
});

const dopingSchema = object({
  Time: string(),
  Place: number(),
  Seconds: number(),
  Name: string(),
  Year: number(),
  Nationality: string(),
  Doping: string().nullable(),
  URL: string().nullable()
}).array();

const temperatureSchema = object({
  baseTemperature: number(),
  monthlyVariance: object({
    year: number(),
    month: number(),
    variance: number()
  }).array()
});

const SCHEMAS: Record<string, ZodSchema> = {
  gdp: gdpSchema,
  doping: dopingSchema,
  temperature: temperatureSchema
};

const SOURCES: RecordProps = {
  gdp: 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json',
  doping:
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json',
  temperature:
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
};

const useApi = async <T>(source: keyof typeof SCHEMAS): Promise<T> => {
  try {
    const response = await fetch(SOURCES[source], { mode: 'cors' });
    const data = (await response.json()) as T;

    const parsedData = SCHEMAS[source].parse(data) as T;

    return parsedData;
  } catch (error: unknown) {
    if (error instanceof ZodError) console.error(error);
    if (error instanceof Error) console.error(error);
    throw error;
  }
};

export { type SchemaProps, useApi };
