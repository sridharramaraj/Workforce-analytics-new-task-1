import { ReactNode, useState } from 'react';
import { AppBar, Avatar, Badge, Box, Divider, Drawer, IconButton, InputBase, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import GridViewRounded from '@mui/icons-material/GridViewRounded';
import GroupsRounded from '@mui/icons-material/GroupsRounded';
import EventAvailableRounded from '@mui/icons-material/EventAvailableRounded';
import BeachAccessRounded from '@mui/icons-material/BeachAccessRounded';
import PaymentsRounded from '@mui/icons-material/PaymentsRounded';
import InsightsRounded from '@mui/icons-material/InsightsRounded';
import SettingsRounded from '@mui/icons-material/SettingsRounded';
import MenuRounded from '@mui/icons-material/MenuRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import NotificationsNoneRounded from '@mui/icons-material/NotificationsNoneRounded';
import LightModeRounded from '@mui/icons-material/LightModeRounded';
import DarkModeRounded from '@mui/icons-material/DarkModeRounded';
import { display } from '../theme';

const NAV = [
  { label: 'Overview', icon: <GridViewRounded /> }, { label: 'People', icon: <GroupsRounded /> },
  { label: 'Attendance', icon: <EventAvailableRounded /> }, { label: 'Time off', icon: <BeachAccessRounded /> },
  { label: 'Payroll', icon: <PaymentsRounded /> }, { label: 'Reports', icon: <InsightsRounded /> },
];

interface Props { mode: 'light' | 'dark'; onToggleMode: () => void; children: ReactNode }

export default function Shell({ mode, onToggleMode, children }: Props) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('Overview');
  const rail = !isDesktop && !isMobile;
  const width = isDesktop ? 244 : 76;

  const nav = (compact: boolean) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 1.5 }} component="nav" aria-label="Primary">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1, py: 1.5, mb: 1 }}>
        <Box aria-hidden sx={{ width: 34, height: 34, borderRadius: '10px 10px 10px 2px', bgcolor: 'primary.main', color: 'background.paper', display: 'grid', placeItems: 'center', fontFamily: display, fontSize: 20, fontWeight: 600 }}>R</Box>
        {!compact && <Typography sx={{ fontFamily: display, fontSize: 21, fontWeight: 600, letterSpacing: -0.3 }}>Rosterly</Typography>}
      </Box>
      <List disablePadding sx={{ flex: 1 }}>
        {NAV.map((n) => (
          <Tooltip key={n.label} title={compact ? n.label : ''} placement="right">
            <ListItemButton selected={active === n.label} onClick={() => { setActive(n.label); setOpen(false); }} aria-current={active === n.label ? 'page' : undefined}
              sx={{ borderRadius: 2, mb: 0.5, justifyContent: compact ? 'center' : 'flex-start', '&.Mui-selected': { bgcolor: 'primary.main', color: 'background.paper', '& .MuiListItemIcon-root': { color: 'inherit' }, '&:hover': { bgcolor: 'primary.main' } } }}>
              <ListItemIcon sx={{ minWidth: compact ? 0 : 40, color: 'text.secondary' }}>{n.icon}</ListItemIcon>
              {!compact && <ListItemText primary={n.label} primaryTypographyProps={{ fontSize: 14.5, fontWeight: 500 }} />}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
      <Divider sx={{ my: 1 }} />
      <ListItemButton sx={{ borderRadius: 2, justifyContent: compact ? 'center' : 'flex-start' }}>
        <ListItemIcon sx={{ minWidth: compact ? 0 : 40, color: 'text.secondary' }}><SettingsRounded /></ListItemIcon>
        {!compact && <ListItemText primary="Settings" primaryTypographyProps={{ fontSize: 14.5, fontWeight: 500 }} />}
      </ListItemButton>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box component="a" href="#main" sx={{ position: 'absolute', left: -999, '&:focus': { left: 8, top: 8, zIndex: 2000, bgcolor: 'background.paper', p: 1, borderRadius: 1 } }}>Skip to content</Box>
      {isMobile ? (
        <Drawer open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: 260, bgcolor: 'background.paper' } }}>{nav(false)}</Drawer>
      ) : (
        <Drawer variant="permanent" PaperProps={{ sx: { width, bgcolor: 'background.paper', borderRight: 1, borderColor: 'divider' } }} sx={{ width, '& .MuiDrawer-paper': { boxSizing: 'border-box' } }}>{nav(rail)}</Drawer>
      )}
      <Box sx={{ ml: isMobile ? 0 : `${width}px` }}>
        <AppBar position="sticky" color="inherit" elevation={0} sx={{ bgcolor: 'background.default', borderBottom: 1, borderColor: 'divider', backdropFilter: 'blur(8px)' }}>
          <Toolbar sx={{ gap: 1.5 }}>
            {isMobile && <IconButton aria-label="Open navigation" edge="start" onClick={() => setOpen(true)}><MenuRounded /></IconButton>}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1, px: 1.5, py: 0.5, flex: 1, maxWidth: 380, bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 2 }}>
              <SearchRounded fontSize="small" sx={{ color: 'text.secondary' }} />
              <InputBase placeholder="Search people, teams, reports" inputProps={{ 'aria-label': 'Search' }} sx={{ flex: 1, fontSize: 14 }} />
            </Box>
            <Box sx={{ flex: 1 }} />
            <Tooltip title={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
              <IconButton onClick={onToggleMode} aria-label="Toggle colour theme">{mode === 'dark' ? <LightModeRounded /> : <DarkModeRounded />}</IconButton>
            </Tooltip>
            <IconButton aria-label="Notifications, 3 unread"><Badge color="secondary" badgeContent={3}><NotificationsNoneRounded /></Badge></IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, pl: 1 }}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: 'secondary.main', fontSize: 14 }}>UK</Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' }, lineHeight: 1.2 }}>
                <Typography variant="body2" fontWeight={600}>Uday Kumar</Typography>
                <Typography variant="caption" color="text.secondary">HR Admin</Typography>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
        <Box component="main" id="main" tabIndex={-1} sx={{ p: { xs: 2, sm: 3, lg: 4 }, maxWidth: 1480, mx: 'auto' }}>{children}</Box>
      </Box>
    </Box>
  );
}
