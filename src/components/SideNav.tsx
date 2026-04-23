import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import { Avatar, Box, IconButton, Tooltip } from '@mui/material'

type NavItem = {
  id: string
  label: string
  icon: React.ReactNode
  active?: boolean
}

const items: NavItem[] = [
  { id: 'dashboard', label: 'Дашборд', icon: <GridViewRoundedIcon fontSize="small" /> },
  { id: 'team', label: 'Команда', icon: <GroupsRoundedIcon fontSize="small" /> },
  { id: 'cards', label: 'Карты', icon: <InsightsRoundedIcon fontSize="small" />, active: true },
  { id: 'settings', label: 'Настройки', icon: <TuneRoundedIcon fontSize="small" /> },
]

export function SideNav() {
  return (
    <Box
      sx={{
        width: 64,
        bgcolor: '#eef3fb',
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 1,
        gap: 1,
      }}
    >
      <Avatar sx={{ width: 36, height: 36, mb: 1 }} />

      {items.map((it) => (
        <Tooltip key={it.id} title={it.label} placement="right">
          <IconButton
            size="small"
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              color: it.active ? 'primary.main' : 'text.secondary',
              bgcolor: it.active ? 'rgba(37, 99, 235, 0.10)' : 'transparent',
              '&:hover': {
                bgcolor: it.active ? 'rgba(37, 99, 235, 0.14)' : 'rgba(0,0,0,0.04)',
              },
            }}
          >
            {it.icon}
          </IconButton>
        </Tooltip>
      ))}

      <Box sx={{ flex: 1 }} />
    </Box>
  )
}

