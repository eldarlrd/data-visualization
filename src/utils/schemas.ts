import {
  object,
  tuple,
  union,
  string,
  number,
  literal,
  type z,
  type ZodSchema
} from 'zod';

const gdp = object({
  data: tuple([string(), number()]).array()
});

const doping = object({
  Time: string(),
  Place: number(),
  Seconds: number(),
  Name: string(),
  Year: number(),
  Nationality: string(),
  Doping: string().nullable(),
  URL: string().nullable()
}).array();

const temperature = object({
  baseTemperature: number(),
  monthlyVariance: object({
    year: number(),
    month: number(),
    variance: number()
  }).array()
});

const topology = object({
  type: literal('Topology'),
  objects: object({
    counties: object({
      type: literal('GeometryCollection'),
      geometries: object({
        type: union([literal('Polygon'), literal('MultiPolygon')]),
        arcs: union([number(), number().array()]).array().array(),
        id: number()
      }).array()
    }),
    states: object({
      type: literal('GeometryCollection'),
      geometries: object({
        type: literal('MultiPolygon'),
        arcs: number().array().array().array(),
        id: string()
      }).array()
    }),
    nation: object({
      type: literal('GeometryCollection'),
      arcs: number().array().array().optional()
    })
  }),
  arcs: tuple([number(), number()]).array().array(),
  bbox: number().array().length(4),
  transform: object({
    scale: tuple([number(), number()]),
    translate: tuple([number(), number()])
  })
});

const education = object({
  fips: number(),
  state: string(),
  area_name: string(),
  bachelorsOrHigher: number()
}).array();

const movies = object({});

interface SchemaProps {
  gdp: z.infer<typeof gdp>;
  doping: z.infer<typeof doping>;
  temperature: z.infer<typeof temperature>;
  topology: z.infer<typeof topology>;
  education: z.infer<typeof education>;
  movies: z.infer<typeof movies>;
}

const SCHEMAS: Record<string, ZodSchema> = {
  gdp,
  doping,
  temperature,
  topology,
  education,
  movies
};

export { type SchemaProps, SCHEMAS };
