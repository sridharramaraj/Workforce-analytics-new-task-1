import { Box, Button, MenuItem, Paper, TextField } from '@mui/material';
import RestartAltRounded from '@mui/icons-material/RestartAltRounded';
import { DEPARTMENTS, defaultFilters, Filters as F, LOCATIONS, STATUSES } from '../data';

interface Props { value: F; onChange: (f: F) => void }

export default function Filters({ value, onChange }: Props) {
  const set = <K extends keyof F>(k: K, v: F[K]) => onChange({ ...value, [k]: v });
  const select = <K extends 'department' | 'location' | 'status'>(k: K, label: string, options: readonly string[]) => (
    <TextField select size="small" label={label} value={value[k]} onChange={(e) => set(k, e.target.value as F[K])}>
      <MenuItem value="All">All</MenuItem>
      {options.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
    </TextField>
  );
  return (
    <Paper variant="outlined" component="section" aria-label="Filters" sx={{ p: 2, display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr) 1fr auto' } }}>
      <TextField size="small" type="date" label="From" value={value.from} onChange={(e) => set('from', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ max: value.to }} />
      <TextField size="small" type="date" label="To" value={value.to} onChange={(e) => set('to', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ min: value.from }} />
      {select('department', 'Department', DEPARTMENTS)}
      {select('location', 'Location', LOCATIONS)}
      {select('status', 'Status', STATUSES)}
      <Box sx={{ display: 'flex' }}>
        <Button onClick={() => onChange(defaultFilters())} startIcon={<RestartAltRounded />} color="inherit" sx={{ color: 'text.secondary' }}>Reset</Button>
      </Box>
    </Paper>
  );
}
