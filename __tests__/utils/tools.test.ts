import { select } from 'd3';
import { type MockInstance } from 'vitest';

import { Spinner } from '@/components/Spinner.ts';
import PAGES from '@/content/pages.yaml';
import {
  createTooltip,
  createVisual,
  handleClick,
  handleMouseOut,
  loadContent,
  type PageProps,
  titleToLink
} from '@/utils/tools.ts';

describe('tools', () => {
  let openSpy: MockInstance;

  beforeEach(() => {
    document.body.innerHTML = '';
    openSpy = vi.spyOn(window, 'open');
  });

  it('load content and hide the spinner', () => {
    document.body.innerHTML = `
      <div id='spinner-slot'></div>
      <svg class='visual' style='display:none'></svg>
    `;

    loadContent();

    expect(select('#spinner-slot').classed('d-none')).toBe(true);
    expect(select('.visual').style('display')).toBe('block');
  });

  it('create a visual when called', () => {
    const visual = createVisual(0, 'chart');

    expect(visual).toContain('<h3>');
    expect(visual).toContain("id='chart'");
    expect(visual).toContain(Spinner());
  });

  it('creates the tooltip and controls its position', () => {
    const mockEvent = {
      clientX: 900,
      clientY: 100,
      target: document.createElement('div')
    } as unknown as MouseEvent;

    createTooltip({
      e: mockEvent,
      posY: 150,
      width: 7.5,
      fillColor: 'lightGreen'
    });

    const tooltip = select('#tooltip');

    expect(tooltip.empty()).toBe(false);
    expect(tooltip.style('display')).toBe('block');
    expect(tooltip.style('top')).toBe('160px'); // +10px for window padding
    expect(tooltip.style('left')).toBe('894px'); // Shift based on overflow
  });

  it('hide the tooltip on mouse out', () => {
    document.body.innerHTML = `<div id='tooltip' style='display:block'></div>`;

    const mockEvent = {
      target: document.createElement('div')
    } as unknown as MouseEvent;

    handleMouseOut(mockEvent, 'green');

    const tooltip = select('#tooltip');

    expect(tooltip.style('display')).toBe('none');
  });

  it("open a link if there's a URL", () => {
    const mockOpen = openSpy.mockImplementation(() => {
      return;
    });
    const mockData = { URL: 'https://example.com' };
    const mockEvent = {} as MouseEvent;

    handleClick(mockEvent, mockData);
    
    expect(mockOpen).toHaveBeenCalledWith('https://example.com', '_blank', 'noreferrer');
    mockOpen.mockRestore();
  });

  it("doesn't open a link if there's no URL", () => {
    const mockOpen = openSpy.mockImplementation(() => {
      return;
    });
    const mockData = { URL: null };
    const mockEvent = {} as MouseEvent;

    handleClick(mockEvent, mockData);

    expect(mockOpen).not.toHaveBeenCalled();
    mockOpen.mockRestore();
  });

  it('convert a title to a link', () => {
    const title: string = (PAGES[0] as PageProps).title;
    const link = titleToLink(title);

    expect(link).toBe('us-gdp');
  });
});
