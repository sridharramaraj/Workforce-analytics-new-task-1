import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, CssBaseline, ThemeProvider, Typography, useMediaQuery } from '@mui/material';
import { buildTheme, display } from './theme';
import { Dashboard, defaultFilters, fetchDashboard, Filters as F } from './data';
import Shell from './components/Shell';
import Filters from './components/Filters';
import { KpiCard } from './components/Kpi';
import { DepartmentChart, StatusDonut, TrendChart } from './components/Charts';
import Activity from './components/Activity';
import { EmptyState, ErrorState, LoadingState } from './components/States';

type Mode = 'light' | 'dark';

export default function App() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<Mode>(() => (localStorage.getItem('rosterly-mode') as Mode) ?? (prefersDark ? 'dark' : 'light'));
  const theme = useMemo(() => buildTheme(mode), [mode]);
  const toggle = () => setMode((m) => { const n = m === 'light' ? 'dark' : 'light'; localStorage.setItem('rosterly-mode', n); return n; });

  const [filters, setFilters] = useState<F>(defaultFilters);
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    let live = true; setLoading(true); setError(null);
    fetchDashboard(filters).then((d) => live && setData(d)).catch((e: Error) => live && setError(e.message)).finally(() => live && setLoading(false));
    return () => { live = false; };
  }, [filters]);
  useEffect(load, [load]);

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Shell mode={mode} onToggleMode={toggle}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">{today}</Typography>
          <Typography variant="h4" component="h1" sx={{ fontFamily: display, fontSize: { xs: 28, md: 36 }, letterSpacing: -0.6 }}>Workforce overview</Typography>
        </Box>
        <Box sx={{ mb: 3 }}><Filters value={filters} onChange={setFilters} /></Box>

        {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={load} /> : !data || data.total === 0 ? <EmptyState onReset={() => setFilters(defaultFilters())} /> : (
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' } }}>
              {data.kpis.map((k, i) => <KpiCard key={k.key} kpi={k} index={i} />)}
            </Box>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' } }}>
              <TrendChart data={data.trend} />
              <StatusDonut data={data.statuses} total={data.total} />
            </Box>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1.2fr' } }}>
              <DepartmentChart data={data.departments} />
              <Activity items={data.activity} />
            </Box>
          </Box>
        )}
      </Shell>
    </ThemeProvider>
  );
}
