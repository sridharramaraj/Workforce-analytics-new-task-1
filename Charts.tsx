import { ReactNode } from 'react';
import { Area, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { Dashboard } from '../data';
import { display } from '../theme';

export function ChartCard({ title, subtitle, summary, height = 300, children }: { title: string; subtitle: string; summary: string; height?: number; children: ReactNode }) {
  return (
    <Paper variant="outlined" component="section" sx={{ p: 2.5, height: '100%' }}>
      <Typography variant="h6" component="h2" sx={{ fontSize: 18 }}>{title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{subtitle}</Typography>
      <Box role="img" aria-label={summary} sx={{ height, position: 'relative' }}>{children}</Box>
    </Paper>
  );
}

const Tip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <Paper variant="outlined" sx={{ px: 1.5, py: 1, boxShadow: 3 }}>
      {label && <Typography variant="caption" color="text.secondary">{label}</Typography>}
      {payload.map((p: any) => <Typography key={p.name} variant="body2" fontWeight={600}>{p.name ?? p.dataKey}: {p.value}</Typography>)}
    </Paper>
  );
};

const fmt = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

export function TrendChart({ data }: { data: Dashboard['trend'] }) {
  const t = useTheme();
  const peak = data.reduce((m, d) => (d.present > m.present ? d : m), data[0]);
  return (
    <ChartCard title="Attendance trend" subtitle="Daily headcount present versus late arrivals" height={320}
      summary={`Attendance over ${data.length} days. Peak of ${peak?.present} present on ${peak ? fmt(peak.date) : ''}.`}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs><linearGradient id="pf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={t.palette.primary.main} stopOpacity={0.3} /><stop offset="1" stopColor={t.palette.primary.main} stopOpacity={0} /></linearGradient></defs>
          <CartesianGrid stroke={t.palette.divider} vertical={false} />
          <XAxis dataKey="date" tickFormatter={fmt} tickLine={false} axisLine={false} tick={{ fill: t.palette.text.secondary, fontSize: 12 }} minTickGap={24} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: t.palette.text.secondary, fontSize: 12 }} />
          <Tooltip content={<Tip />} labelFormatter={fmt} />
          <Area type="monotone" dataKey="present" name="Present" stroke={t.palette.primary.main} strokeWidth={2.5} fill="url(#pf)" />
          <Line type="monotone" dataKey="late" name="Late" stroke={t.palette.secondary.main} strokeWidth={2} dot={false} strokeDasharray="5 4" />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function DepartmentChart({ data }: { data: Dashboard['departments'] }) {
  const t = useTheme();
  return (
    <ChartCard title="People by department" subtitle="Current headcount" height={300}
      summary={`Department headcount: ${data.map((d) => `${d.name} ${d.count}`).join(', ')}.`}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }} barSize={14}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={86} tickLine={false} axisLine={false} tick={{ fill: t.palette.text.primary, fontSize: 13 }} />
          <Tooltip content={<Tip />} cursor={{ fill: t.palette.action.hover }} />
          <Bar dataKey="count" name="Employees" radius={[0, 8, 8, 0]} fill={t.palette.primary.main} label={{ position: 'right', fill: t.palette.text.secondary, fontSize: 12 }} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function StatusDonut({ data, total }: { data: Dashboard['statuses']; total: number }) {
  const t = useTheme();
  const colors: Record<string, string> = { Active: t.palette.primary.main, Remote: t.palette.secondary.main, 'On leave': t.palette.warning.main, Probation: t.palette.text.secondary };
  return (
    <ChartCard title="Workforce mix" subtitle="Share of employees by status" height={300}
      summary={`Workforce by status: ${data.map((d) => `${d.name} ${d.value}`).join(', ')}.`}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="86%" paddingAngle={2} stroke={t.palette.background.paper} strokeWidth={3}>
            {data.map((d) => <Cell key={d.name} fill={colors[d.name]} />)}
          </Pie>
          <Tooltip content={<Tip />} />
        </PieChart>
      </ResponsiveContainer>
      <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none', textAlign: 'center' }}>
        <Box><Typography sx={{ fontFamily: display, fontSize: 34, lineHeight: 1 }}>{total}</Typography><Typography variant="caption" color="text.secondary">employees</Typography></Box>
      </Box>
      <Box sx={{ position: 'absolute', bottom: -6, left: 0, right: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5 }}>
        {data.map((d) => <Box key={d.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors[d.name] }} /><Typography variant="caption" color="text.secondary">{d.name}</Typography></Box>)}
      </Box>
    </ChartCard>
  );
}
