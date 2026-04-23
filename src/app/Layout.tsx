import { Box } from '@mui/material'
import type { ReactNode } from 'react'
import { SideNav } from '../components/SideNav'
import { TopBar } from '../components/TopBar'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      <SideNav />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar />
        <Box
          component="main"
          sx={{
            flex: 1,
            px: 3,
            pb: 3,
            overflow: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}

