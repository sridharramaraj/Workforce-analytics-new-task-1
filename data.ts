export const DEPARTMENTS = ['Engineering', 'Design', 'Sales', 'Operations', 'Finance', 'People'] as const;
export const LOCATIONS = ['Chennai', 'Bengaluru', 'Hyderabad', 'Remote'] as const;
export const STATUSES = ['Active', 'Remote', 'On leave', 'Probation'] as const;
export type Department = (typeof DEPARTMENTS)[number];
export type Location = (typeof LOCATIONS)[number];
export type Status = (typeof STATUSES)[number];

export interface Filters { from: string; to: string; department: 'All' | Department; location: 'All' | Location; status: 'All' | Status }
export interface Employee { id: number; name: string; department: Department; location: Location; status: Status }
export interface ActivityItem { id: number; employee: string; department: Department; action: string; date: string; tone: 'ok' | 'warn' | 'info' }
export interface Kpi { key: string; label: string; value: string; delta: number; unit: string; goodWhenUp: boolean }
export interface Dashboard {
  kpis: Kpi[];
  trend: { date: string; present: number; late: number }[];
  departments: { name: string; count: number }[];
  statuses: { name: Status; value: number }[];
  activity: ActivityItem[];
  total: number;
}

const iso = (d: Date) => d.toISOString().slice(0, 10);
export const daysAgo = (n: number) => iso(new Date(Date.now() - n * 864e5));
export const defaultFilters = (): Filters => ({ from: daysAgo(13), to: daysAgo(0), department: 'All', location: 'All', status: 'All' });

// Deterministic RNG so the mock data is stable between reloads
function rng(seed: number) {
  return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const rand = rng(42);
const pick = <T,>(a: readonly T[]): T => a[Math.floor(rand() * a.length)];
const FIRST = ['Aarav', 'Meera', 'Karthik', 'Divya', 'Rahul', 'Ananya', 'Vikram', 'Priya', 'Sanjay', 'Nisha', 'Arjun', 'Kavya', 'Ishaan', 'Lakshmi', 'Rohan', 'Sneha'];
const LAST = ['Raman', 'Iyer', 'Nair', 'Reddy', 'Kumar', 'Menon', 'Das', 'Pillai', 'Sharma', 'Naidu', 'Gupta', 'Subramanian'];
const weighted = (): Status => { const r = rand(); return r < 0.62 ? 'Active' : r < 0.82 ? 'Remote' : r < 0.9 ? 'On leave' : 'Probation'; };

export const EMPLOYEES: Employee[] = Array.from({ length: 248 }, (_, i) => ({
  id: i + 1, name: `${pick(FIRST)} ${pick(LAST)}`, department: pick(DEPARTMENTS), location: pick(LOCATIONS), status: weighted(),
}));

const ACTIONS: [string, ActivityItem['tone']][] = [
  ['checked in late', 'warn'], ['requested leave', 'info'], ['completed onboarding', 'ok'], ['moved to a new team', 'info'],
  ['submitted timesheet', 'ok'], ['missed check-out', 'warn'], ['was promoted', 'ok'], ['updated work location', 'info'],
];
export const ACTIVITY: ActivityItem[] = Array.from({ length: 60 }, (_, i) => {
  const e = pick(EMPLOYEES); const [action, tone] = pick(ACTIONS);
  return { id: i, employee: e.name, department: e.department, action, tone, date: new Date(Date.now() - rand() * 20 * 864e5).toISOString() };
}).sort((a, b) => b.date.localeCompare(a.date));

const dayRate = (dateStr: string) => {
  const d = new Date(dateStr); const wk = d.getDay() === 0 || d.getDay() === 6;
  const n = rng(d.getTime() / 864e5)();
  return wk ? 0.08 + n * 0.06 : 0.86 + n * 0.09;
};

export function compute(f: Filters): Dashboard {
  const emps = EMPLOYEES.filter((e) =>
    (f.department === 'All' || e.department === f.department) &&
    (f.location === 'All' || e.location === f.location) &&
    (f.status === 'All' || e.status === f.status));

  const available = emps.filter((e) => e.status !== 'On leave').length;
  const trend: Dashboard['trend'] = [];
  for (let t = new Date(f.from).getTime(); t <= new Date(f.to).getTime() && trend.length < 90; t += 864e5) {
    const date = iso(new Date(t)); const r = dayRate(date); const present = Math.round(available * r);
    trend.push({ date, present, late: Math.round(present * (0.03 + (1 - r) * 0.5)) });
  }
  const last = trend[trend.length - 1]; const prev = trend[trend.length - 2] ?? last;
  const half = Math.floor(trend.length / 2) || 1;
  const avg = (xs: typeof trend) => (xs.length ? xs.reduce((s, x) => s + x.present, 0) / xs.length / Math.max(available, 1) : 0);
  const rate = avg(trend) * 100; const rateDelta = (avg(trend.slice(half)) - avg(trend.slice(0, half))) * 100;
  const onLeave = emps.filter((e) => e.status === 'On leave').length;
  const ids = new Set(emps.map((e) => e.id));
  const names = new Set(emps.map((e) => e.name));
  const activity = ACTIVITY.filter((a) => names.has(a.employee) && a.date.slice(0, 10) >= f.from && a.date.slice(0, 10) <= f.to);

  return {
    total: emps.length,
    kpis: [
      { key: 'headcount', label: 'Total employees', value: String(emps.length), delta: ids.size ? Math.round(ids.size * 0.012) : 0, unit: 'hires', goodWhenUp: true },
      { key: 'present', label: 'Present today', value: String(last?.present ?? 0), delta: (last?.present ?? 0) - (prev?.present ?? 0), unit: 'vs yesterday', goodWhenUp: true },
      { key: 'rate', label: 'Attendance rate', value: `${rate.toFixed(1)}%`, delta: +rateDelta.toFixed(1), unit: 'pts', goodWhenUp: true },
      { key: 'leave', label: 'On leave', value: String(onLeave), delta: Math.round(onLeave * 0.1), unit: 'this week', goodWhenUp: false },
      { key: 'late', label: 'Late arrivals', value: String(last?.late ?? 0), delta: (last?.late ?? 0) - (prev?.late ?? 0), unit: 'vs yesterday', goodWhenUp: false },
    ],
    trend,
    departments: DEPARTMENTS.map((name) => ({ name, count: emps.filter((e) => e.department === name).length })).sort((a, b) => b.count - a.count),
    statuses: STATUSES.map((name) => ({ name, value: emps.filter((e) => e.status === name).length })).filter((s) => s.value > 0),
    activity: activity.slice(0, 8),
  };
}

/** Simulated API. Add ?state=error or ?state=empty to the URL to preview those states. */
export function fetchDashboard(f: Filters): Promise<Dashboard> {
  const mode = new URLSearchParams(location.search).get('state');
  return new Promise((resolve, reject) => setTimeout(() => {
    if (mode === 'error') return reject(new Error('The analytics service did not respond.'));
    resolve(mode === 'empty' ? compute({ ...f, department: 'Finance', location: 'Remote', status: 'Probation', from: '2000-01-01', to: '2000-01-02' }) : compute(f));
  }, 700));
}
