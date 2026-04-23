import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'

/** Статус последней карты результативности за период (по хронологии) */
type PerformanceCardStatus = 'active' | 'not_created' | 'draft' | 'development'

const CARD_STATUS_META: Record<
  PerformanceCardStatus,
  { bg: string; color: string; label: string }
> = {
  active: { bg: '#22c55e', color: '#ffffff', label: 'Активная' },
  not_created: { bg: '#e5e7eb', color: '#4b5563', label: 'Не создана' },
  draft: { bg: '#e0f2fe', color: '#075985', label: 'Черновик' },
  development: { bg: '#bae6fd', color: '#075985', label: 'Разработка' },
}

/** Цвета овала в таблице по статусу последней КР */
const STATUS_BAR_STYLE: Record<
  PerformanceCardStatus,
  {
    fill: string
    score: string
    periodTagBg: string
    arrowBg: string
    arrowColor: string
  }
> = {
  active: {
    fill: '#86efac',
    score: '#064e3b',
    periodTagBg: '#eff6ff',
    arrowBg: 'rgba(6,95,70,0.18)',
    arrowColor: 'rgba(6,95,70,0.85)',
  },
  not_created: {
    fill: '#e5e7eb',
    score: '#6b7280',
    periodTagBg: '#f3f4f6',
    arrowBg: 'rgba(55,65,81,0.15)',
    arrowColor: 'rgba(55,65,81,0.75)',
  },
  draft: {
    fill: '#e0f2fe',
    score: '#0c4a6e',
    periodTagBg: '#eff6ff',
    arrowBg: 'rgba(29,78,216,0.18)',
    arrowColor: 'rgba(29,78,216,0.85)',
  },
  development: {
    fill: '#bfdbfe',
    score: '#1e3a8a',
    periodTagBg: '#eff6ff',
    arrowBg: 'rgba(30,64,175,0.14)',
    arrowColor: 'rgba(30,64,175,0.85)',
  },
}

type LastCardByQuarter = Partial<Record<0 | 1 | 2 | 3, PerformanceCardStatus>>

function resolveQuarterLastStatus(
  quarterIdx: 0 | 1 | 2 | 3,
  hasValue: boolean,
  lastByQuarter: LastCardByQuarter | undefined,
  allGrayRow: boolean,
): PerformanceCardStatus {
  if (allGrayRow) return 'not_created'
  const explicit = lastByQuarter?.[quarterIdx]
  if (explicit) return explicit
  return hasValue ? 'active' : 'not_created'
}

type EmployeeRow = {
  fio: string
  position: string
  org: string
  periods: number[] // percent values per period (quarterly or yearly)
  cardType?: 'quarter' | 'year'
  multiCardsByQuarter?: Partial<Record<0 | 1 | 2 | 3, number>>
  borderByQuarter?: Partial<Record<0 | 1 | 2 | 3, string>>
  /** все овалы строки — светло-серые (демо для отдельных строк) */
  allOvalsLightGray?: boolean
  /**
   * Статус последней карты результативности за квартал (по хронологии внутри периода).
   * Цвет овала в столбце соответствует этому статусу.
   */
  lastCardStatusByQuarter?: LastCardByQuarter
  /** Для годовой карты — статус последней КР за год */
  yearLastCardStatus?: PerformanceCardStatus
}

const rows: EmployeeRow[] = [
  {
    fio: 'Алексеев Алексей\nАлексеевич',
    position: 'Главный инженер\nразработки',
    org:
      'Департамент развития общебанковских\nи собственных платформенных решений/\nУправление открытых систем',
    periods: [87.22, 99.22, 92.14, 101.05],
    cardType: 'quarter',
    lastCardStatusByQuarter: {
      0: 'active',
      1: 'development',
      2: 'draft',
      3: 'active',
    },
  },
  {
    fio: 'Алексеев Алексей\nАлексеевич',
    position: 'Главный инженер\nразработки',
    org:
      'Департамент развития общебанковских\nи собственных платформенных решений/\nУправление закрытых систем',
    periods: [87.22, 90.01, 88.7, 93.44],
    cardType: 'quarter',
    // пример: во 2 квартале две карты результативности; последняя по хронологии — черновик
    multiCardsByQuarter: { 1: 2 },
    lastCardStatusByQuarter: {
      0: 'active',
      1: 'not_created',
      2: 'development',
      3: 'draft',
    },
  },
  {
    fio: 'Алексеев Алексей\nАлексеевич',
    position: 'Главный инженер\nразработки',
    org:
      'Департамент развития общебанковских\nи собственных платформенных решений/\nУправление прикрытых систем',
    // годовая карта: один итоговый показатель за год
    periods: [96.8],
    cardType: 'year',
    yearLastCardStatus: 'active',
  },
  {
    fio: 'Алексеев Алексей\nАлексеевич',
    position: 'Главный инженер\nразработки',
    org:
      'Департамент развития общебанковских\nи собственных платформенных решений/\nУправление открытых систем',
    periods: [0, 0, 0, 0],
    cardType: 'quarter',
    allOvalsLightGray: true,
  },
  {
    fio: 'Алексеев Алексей\nАлексеевич',
    position: 'Главный инженер\nразработки',
    org:
      'Департамент развития общебанковских\nи собственных платформенных решений/\nУправление открытых систем',
    periods: [87.22, 134.22, 128.22, 96.4],
    cardType: 'quarter',
    // нижняя строка: оранжевая обводка только у 3 квартала
    borderByQuarter: { 2: '#f59e0b' },
    lastCardStatusByQuarter: {
      0: 'active',
      1: 'active',
      2: 'development',
      3: 'not_created',
    },
  },
]

function formatPct(v: number) {
  return `${v.toFixed(2).replace('.', ',')}%`
}

function quarterLabel(qIndex: number, year: number) {
  return `${qIndex + 1}Q${year}`
}

/** Единый серый цвет текста периода во всех овалах */
const PERIOD_LABEL_COLOR = '#6b7280'

function CardStatusTag({
  status,
  highlight,
}: {
  status: PerformanceCardStatus
  highlight?: boolean
}) {
  const meta = CARD_STATUS_META[status]
  return (
    <Chip
      label={meta.label}
      size="small"
      sx={{
        height: 22,
        flexShrink: 0,
        fontSize: 11,
        fontWeight: 600,
        bgcolor: meta.bg,
        color: meta.color,
        border: highlight ? '1.5px solid #f59e0b' : 'none',
        '& .MuiChip-label': { px: 1, py: 0 },
      }}
    />
  )
}

function NotFormedTag() {
  return (
    <Chip
      label="не сформирована"
      size="small"
      variant="outlined"
      sx={{
        height: 22,
        flexShrink: 0,
        fontSize: 11,
        fontWeight: 600,
        color: '#6b7280',
        borderColor: '#d1d5db',
        '& .MuiChip-label': { px: 1, py: 0 },
      }}
    />
  )
}

function PeriodBars({
  values,
  type,
  multiCardsByQuarter,
  borderByQuarter,
  allOvalsLightGray,
  lastCardStatusByQuarter,
  yearLastCardStatus,
}: {
  values: number[]
  type?: EmployeeRow['cardType']
  multiCardsByQuarter?: EmployeeRow['multiCardsByQuarter']
  borderByQuarter?: EmployeeRow['borderByQuarter']
  allOvalsLightGray?: boolean
  lastCardStatusByQuarter?: LastCardByQuarter
  yearLastCardStatus?: PerformanceCardStatus
}) {
  const year = 2026
  const segmentWidth = 116
  const gapPx = 6 // gap: 0.75 * 8px (MUI spacing)
  const yearWidth = 4 * segmentWidth + 3 * gapPx

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)

  const menuOpen = Boolean(menuAnchorEl)
  const menuItems = useMemo(() => {
    return [
      {
        label: `КР 1Q2026 01.01.2026 – 25.01.2026`,
        score: `99,21%`,
        status: 'active' as const,
      },
      {
        label: `КР 1Q2026 26.01.2026 – 10.02.2026`,
        status: 'development' as const,
      },
      {
        label: `КР 1Q2026 11.02.2026 – 05.03.2026`,
        status: 'development' as const,
        highlightStatus: true as const,
      },
      {
        label: `КР 1Q2026 06.03.2026 – 15.03.2026`,
        status: 'draft' as const,
      },
      {
        label: `КР 1Q2026 16.03.2026 – 31.03.2026`,
        status: 'not_created' as const,
      },
    ]
  }, [])

  if (type === 'year') {
    const v = values[0] ?? 0
    const yStatus = yearLastCardStatus ?? 'active'
    const yBar = STATUS_BAR_STYLE[yStatus]
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 320 }}>
        <Box
          sx={{
            height: 24,
            width: yearWidth, // как 4 квартальные + gap'ы
            px: 1.25,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 999,
            bgcolor: allOvalsLightGray ? '#e5e7eb' : yBar.fill,
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              fontSize: 10,
              fontWeight: 700,
              color: PERIOD_LABEL_COLOR,
              bgcolor: allOvalsLightGray ? '#f3f4f6' : yBar.periodTagBg,
              borderRadius: 999,
              px: 1,
              py: 0.25,
              lineHeight: 1,
              whiteSpace: 'nowrap',
            }}
          >
            {year}
          </Box>
          <Box
            sx={{
              fontSize: 12,
              fontWeight: 700,
              color: allOvalsLightGray ? '#111827' : yBar.score,
              whiteSpace: 'nowrap',
            }}
          >
            {formatPct(v)}
          </Box>
        </Box>
      </Box>
    )
  }

  const segments = 4

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: yearWidth }}>
      {Array.from({ length: segments }).map((_, idx) => {
        const v = values[idx] ?? 0
        const hasValue = v > 0
        const period = quarterLabel(idx, year)
        const hasMultiple = (multiCardsByQuarter?.[idx as 0 | 1 | 2 | 3] ?? 0) > 1
        const isQ2 = idx === 1
        const isQ3 = idx === 2
        const isQ4 = idx === 3
        const isQ2SingleWithScore = hasValue && isQ2 && !hasMultiple
        const isQ3WithScore = hasValue && isQ3
        const barStatus = resolveQuarterLastStatus(
          idx as 0 | 1 | 2 | 3,
          hasValue,
          lastCardStatusByQuarter,
          !!allOvalsLightGray,
        )
        const barStyle = STATUS_BAR_STYLE[barStatus]
        const filledBg = barStyle.fill
        const scoreColor = hasValue ? barStyle.score : 'text.secondary'
        const periodArrowBg = barStyle.arrowBg
        const periodArrowColor = barStyle.arrowColor
        const periodTagBg = allOvalsLightGray ? '#f3f4f6' : barStyle.periodTagBg
        const borderColor = borderByQuarter?.[idx as 0 | 1 | 2 | 3]
        const showPeriodTag = true
        return (
        <Box
          key={idx}
          sx={{
            position: 'relative',
            height: 24,
            width: segmentWidth,
            px: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 999,
            bgcolor: filledBg,
            border: borderColor ? `2px solid ${borderColor}` : undefined,
          }}
        >
          {showPeriodTag ? (
            <Box
              sx={{
                fontSize: 10,
                fontWeight: 700,
                color: PERIOD_LABEL_COLOR,
                bgcolor: periodTagBg,
                borderRadius: 999,
                px: 0.6,
                py: 0.25,
                lineHeight: 1,
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.3,
              }}
            >
              {period}
              {hasMultiple ? (
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: 999,
                    bgcolor: periodArrowBg,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  role="button"
                  aria-label="Показать карты за период"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation()
                    setMenuAnchorEl(e.currentTarget)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      e.stopPropagation()
                      setMenuAnchorEl(e.currentTarget as unknown as HTMLElement)
                    }
                  }}
                >
                  <KeyboardArrowDownRoundedIcon
                    sx={{ fontSize: 11, color: periodArrowColor }}
                  />
                </Box>
              ) : null}
            </Box>
          ) : null}
          {!hasMultiple && !isQ2SingleWithScore && !isQ3WithScore && !isQ4 ? (
            hasValue ? (
              <Box
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: scoreColor,
                  whiteSpace: 'nowrap',
                  ml: 1.5,
                }}
              >
                {formatPct(v)}
              </Box>
            ) : allOvalsLightGray ? null : (
              <Box sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', ml: 1.5 }}>
                —
              </Box>
            )
          ) : null}
        </Box>
        )
      })}

      <Menu
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={() => {
          setMenuAnchorEl(null)
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: { mt: 0.5, borderRadius: 2, minWidth: 320 },
          },
        }}
      >
        {menuItems.map((it) => (
          <MenuItem
            key={it.label}
            dense
            onClick={() => {
              // пока только закрываем; дальше можно навесить переход/выбор
              setMenuAnchorEl(null)
            }}
            sx={{ whiteSpace: 'nowrap' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Typography variant="body2" sx={{ flex: 1, minWidth: 0 }}>
                {it.label}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                {it.status === 'draft' || it.status === 'development' ? (
                  <NotFormedTag />
                ) : it.status === 'not_created' ? null : (
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {it.score}
                  </Typography>
                )}
                <CardStatusTag status={it.status} highlight={it.highlightStatus} />
              </Box>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export function PerformanceCardsPage() {
  return (
    <Stack spacing={2.5} sx={{ pt: 2.5 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="h4">Карты результативности</Typography>
        <InfoOutlinedIcon fontSize="small" color="action" />
      </Stack>

      <Paper sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2" color="text.secondary">
              Выберите год
            </Typography>
            <Select size="small" value={2025} sx={{ width: 110 }}>
              <MenuItem value={2025}>2025</MenuItem>
              <MenuItem value={2024}>2024</MenuItem>
              <MenuItem value={2023}>2023</MenuItem>
            </Select>
          </Stack>

          <FormControlLabel
            control={<Checkbox defaultChecked size="small" />}
            label={
              <Typography variant="body2" color="text.secondary">
                Сотрудники прямого подчинения
              </Typography>
            }
          />

          <Box sx={{ flex: 1 }} />

          <ToggleButtonGroup size="small" exclusive value="deps">
            <ToggleButton value="deps" sx={{ px: 2 }}>
              Подразделения
            </ToggleButton>
            <ToggleButton value="list" sx={{ px: 2 }}>
              Список
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        <Divider sx={{ my: 1.5 }} />

        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
          <Typography variant="body2" color="text.secondary">
            Требуемые действия:
          </Typography>
          <Chip size="small" label="Утвердить оценку сотруднику 10" color="primary" variant="outlined" />
          <Chip size="small" label="Отправить на акцептование 10" color="primary" variant="outlined" />
          <Chip size="small" label="Оценить KPI 10" color="primary" variant="outlined" />
          <Chip size="small" label="Утвердить оценку сотруднику 4" color="error" variant="outlined" />
          <Chip size="small" label="Отправить на акцептование 4" color="error" variant="outlined" />
          <Chip size="small" label="Создать KPI 4" color="error" variant="outlined" />
          <Box sx={{ flex: 1 }} />
          <Button size="small" variant="text">
            Сбросить
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 1150 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 260, fontWeight: 700 }}>ФИО</TableCell>
              <TableCell sx={{ width: 220, fontWeight: 700 }}>Должность</TableCell>
              <TableCell sx={{ width: 360, fontWeight: 700 }}>Подразделение</TableCell>
              <TableCell sx={{ fontWeight: 700, minWidth: 520 }}>
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  <Typography sx={{ fontWeight: 700 }}>
                    Карты результативности, периоды
                  </Typography>
                  <InfoOutlinedIcon fontSize="small" color="action" />
                </Stack>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r, idx) => (
              <TableRow key={idx} hover>
                <TableCell sx={{ whiteSpace: 'pre-line', color: 'text.primary' }}>
                  {r.fio}
                </TableCell>
                <TableCell sx={{ whiteSpace: 'pre-line', color: 'text.primary' }}>
                  {r.position}
                </TableCell>
                <TableCell sx={{ whiteSpace: 'pre-line', color: 'text.secondary' }}>
                  {r.org}
                </TableCell>
                <TableCell>
                  <PeriodBars
                    values={r.periods}
                    type={r.cardType}
                    multiCardsByQuarter={r.multiCardsByQuarter}
                    borderByQuarter={r.borderByQuarter}
                    allOvalsLightGray={r.allOvalsLightGray}
                    lastCardStatusByQuarter={r.lastCardStatusByQuarter}
                    yearLastCardStatus={r.yearLastCardStatus}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  )
}

