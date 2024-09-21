import { type MockInstance } from 'vitest';
import { ZodError } from 'zod';

import mockDopingData from '!/doping.json';
import mockGdpData from '!/gdp.json';
import mockTemperatureData from '!/temperature.json';
import { SCHEMAS } from '@/utils/schemas.ts';
import { SOURCES, useApi } from '@/utils/useApi.ts';

describe('useApi', () => {
  let fetchSpy: MockInstance;

  beforeEach(() => {
    fetchSpy = vi.spyOn(window, 'fetch');
  });

  it('fetches and returns parsed GDP data', async () => {
    fetchSpy.mockResolvedValue({
      json: () => Promise.resolve(mockGdpData)
    } as Response);

    const parsedData = await useApi('gdp');

    expect(parsedData).toStrictEqual(SCHEMAS.gdp.parse(mockGdpData));
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(SOURCES.gdp);
  });

  it('fetches and returns parsed Doping data', async () => {
    fetchSpy.mockResolvedValue({
      json: () => Promise.resolve(mockDopingData)
    } as Response);

    const parsedData = await useApi('doping');

    expect(parsedData).toStrictEqual(SCHEMAS.doping.parse(mockDopingData));
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(SOURCES.doping);
  });

  it('fetches and returns parsed Temperature data', async () => {
    fetchSpy.mockResolvedValue({
      json: () => Promise.resolve(mockTemperatureData)
    } as Response);

    const parsedData = await useApi('temperature');

    expect(parsedData).toStrictEqual(
      SCHEMAS.temperature.parse(mockTemperatureData)
    );
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(SOURCES.temperature);
  });

  it('throws a ZodError when the data is invalid', async () => {
    fetchSpy.mockResolvedValue({
      json: () => Promise.resolve()
    } as Response);

    await expect(useApi('gdp')).rejects.toThrowError(ZodError);
  });
});
