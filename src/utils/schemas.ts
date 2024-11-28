import { object, tuple, string, number, type z, type ZodSchema } from 'zod';

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

interface SchemaProps {
  gdp: z.infer<typeof gdpSchema>;
  doping: z.infer<typeof dopingSchema>;
  temperature: z.infer<typeof temperatureSchema>;
}

const SCHEMAS: Record<string, ZodSchema> = {
  gdp: gdpSchema,
  doping: dopingSchema,
  temperature: temperatureSchema
};

export { type SchemaProps, SCHEMAS };
