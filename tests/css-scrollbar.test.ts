import { describe, it, expect } from 'vitest';
import { generateScrollbar } from '../src/css-scrollbar/index.js';

describe('css-scrollbar', () => {
  it('generates standard and webkit scrollbar styles', () => {
    const res = generateScrollbar({
      width: 10,
      trackColor: '#f1f1f1',
      thumbColor: '#888888',
      hoverColor: '#555555',
      thumbRadius: 5,
      selector: '.custom-scroll',
    });

    expect(res.standardCss).toContain('.custom-scroll {');
    expect(res.standardCss).toContain('scrollbar-width:');
    expect(res.standardCss).toContain('scrollbar-color: #888888 #f1f1f1;');

    expect(res.webkitCss).toContain('.custom-scroll::-webkit-scrollbar {');
    expect(res.webkitCss).toContain('.custom-scroll::-webkit-scrollbar-thumb {');
    expect(res.webkitCss).toContain('border-radius: 5px;');
    expect(res.webkitCss).toContain('.custom-scroll::-webkit-scrollbar-thumb:hover {');
  });
});
