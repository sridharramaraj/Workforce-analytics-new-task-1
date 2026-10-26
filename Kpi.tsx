import { Box, Paper, Skeleton, Typography } from '@mui/material';
import ArrowOutwardRounded from '@mui/icons-material/ArrowOutwardRounded';
import SouthEastRounded from '@mui/icons-material/SouthEastRounded';
import { Kpi as K } from '../data';
import { display } from '../theme';

const ACCENTS = ['primary.main', 'secondary.main', 'primary.main', 'warning.main', 'secondary.main'];

export function KpiCard({ kpi, index }: { kpi: K; index: number }) {
  const up = kpi.delta >= 0; const good = kpi.delta === 0 ? true : up === kpi.goodWhenUp;
  return (
    <Paper variant="outlined" sx={{ p: 2.25, position: 'relative', overflow: 'hidden', transition: 'transform .2s, border-color .2s', '&:hover': { transform: 'translateY(-2px)', borderColor: 'text.secondary' } }}>
      <Box aria-hidden sx={{ position: 'absolute', left: 0, top: 18, bottom: 18, width: 3, borderRadius: '0 3px 3px 0', bgcolor: ACCENTS[index] }} />
      <Typography variant="body2" color="text.secondary" fontWeight={500}>{kpi.label}</Typography>
      <Typography sx={{ fontFamily: display, fontSize: { xs: 34, xl: 38 }, fontWeight: 500, lineHeight: 1.15, my: 0.75, letterSpacing: -0.8 }}>{kpi.value}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: good ? 'success.main' : 'error.main' }}>
        {up ? <ArrowOutwardRounded sx={{ fontSize: 16 }} /> : <SouthEastRounded sx={{ fontSize: 16 }} />}
        <Typography variant="caption" fontWeight={600}>{up ? '+' : ''}{kpi.delta}</Typography>
        <Typography variant="caption" color="text.secondary">{kpi.unit}</Typography>
      </Box>
    </Paper>
  );
}

export const KpiSkeleton = () => (
  <Paper variant="outlined" sx={{ p: 2.25 }}><Skeleton width="55%" /><Skeleton height={52} width="40%" /><Skeleton width="45%" /></Paper>
);
