import { Avatar, Box, Chip, Paper, Typography } from '@mui/material';
import { ActivityItem } from '../data';

const initials = (n: string) => n.split(' ').map((p) => p[0]).join('');
const ago = (iso: string) => { const h = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 36e5)); return h < 24 ? `${h}h ago` : `${Math.round(h / 24)}d ago`; };
const TONE = { ok: 'success', warn: 'warning', info: 'default' } as const;

export default function Activity({ items }: { items: ActivityItem[] }) {
  return (
    <Paper variant="outlined" component="section" sx={{ p: 2.5, height: '100%' }}>
      <Typography variant="h6" component="h2" sx={{ fontSize: 18 }}>Recent activity</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Latest events in the selected range</Typography>
      {items.length === 0 ? <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>No activity for these filters.</Typography> : (
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {items.map((a) => (
            <Box component="li" key={a.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.25, borderTop: 1, borderColor: 'divider' }}>
              <Avatar sx={{ width: 34, height: 34, fontSize: 13, bgcolor: 'action.selected', color: 'text.primary' }}>{initials(a.employee)}</Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" noWrap><b>{a.employee}</b> {a.action}</Typography>
                <Typography variant="caption" color="text.secondary">{a.department} · {ago(a.date)}</Typography>
              </Box>
              <Chip size="small" color={TONE[a.tone]} variant="outlined" label={a.tone === 'ok' ? 'Done' : a.tone === 'warn' ? 'Review' : 'Update'} sx={{ display: { xs: 'none', sm: 'inline-flex' } }} />
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}
