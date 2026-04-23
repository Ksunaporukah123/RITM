import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined'
import {
  Badge,
  Box,
  Breadcrumbs,
  IconButton,
  Link,
  Typography,
} from '@mui/material'

export function TopBar() {
  return (
    <Box
      sx={{
        height: 56,
        px: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Breadcrumbs aria-label="breadcrumb" sx={{ color: 'text.secondary' }}>
        <Link underline="hover" color="inherit" href="#">
          Главная
        </Link>
        <Link underline="hover" color="inherit" href="#">
          Целеполагание
        </Link>
        <Typography color="text.primary">Карты результативности</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton size="small" aria-label="call">
          <PhoneInTalkOutlinedIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" aria-label="notifications">
          <Badge color="error" variant="dot">
            <NotificationsNoneRoundedIcon fontSize="small" />
          </Badge>
        </IconButton>
        <IconButton size="small" aria-label="mail">
          <MailOutlineRoundedIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  )
}

