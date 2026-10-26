import { describe, expect, it } from 'vitest';
import { compute, defaultFilters, EMPLOYEES } from './data';

describe('compute', () => {
  it('returns five KPIs and totals matching the roster', () => {
    const d = compute(defaultFilters());
    expect(d.kpis).toHaveLength(5);
    expect(d.total).toBe(EMPLOYEES.length);
    expect(d.departments.reduce((s, x) => s + x.count, 0)).toBe(d.total);
  });
  it('narrows results with filters', () => {
    expect(compute({ ...defaultFilters(), department: 'Design' }).total).toBeLessThan(EMPLOYEES.length);
  });
  it('handles an empty selection', () => {
    expect(compute({ ...defaultFilters(), status: 'On leave', department: 'Finance', location: 'Remote', from: '2000-01-01', to: '2000-01-01' }).trend.length).toBe(1);
  });
});
