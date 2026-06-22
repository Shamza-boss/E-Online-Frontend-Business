'use client';

import {
  Box,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import TableRowsIcon from '@mui/icons-material/TableRows';
import { AcademicLevelDto } from '@/app/_lib/interfaces/types';

export type LibraryViewMode = 'cards' | 'table';

interface LibraryToolbarProps {
  viewMode: LibraryViewMode;
  onViewModeChange: (mode: LibraryViewMode) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  academicLevelId: string;
  onAcademicLevelChange: (value: string) => void;
  academicOptions: AcademicLevelDto[];
  unlinkedOnly: boolean;
  onUnlinkedOnlyChange: (value: boolean) => void;
}

export default function LibraryToolbar({
  viewMode,
  onViewModeChange,
  searchTerm,
  onSearchChange,
  academicLevelId,
  onAcademicLevelChange,
  academicOptions,
  unlinkedOnly,
  onUnlinkedOnlyChange,
}: LibraryToolbarProps) {
  return (
    <Stack spacing={2} sx={{ mb: 3 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1.5}
        alignItems={{ xs: 'stretch', md: 'center' }}
      >
        <TextField
          size="small"
          placeholder="Search by textbook, course, grade, or subject…"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
        />

        <FormControl size="small" sx={{ minWidth: { md: 180 } }}>
          <InputLabel id="library-grade-filter">Grade</InputLabel>
          <Select
            labelId="library-grade-filter"
            label="Grade"
            value={academicLevelId}
            onChange={(e) => onAcademicLevelChange(e.target.value)}
          >
            <MenuItem value="">All grades</MenuItem>
            {academicOptions.map((level) => (
              <MenuItem key={level.id} value={level.id}>
                {level.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <ToggleButtonGroup
          size="small"
          exclusive
          value={viewMode}
          onChange={(_, value: LibraryViewMode | null) => {
            if (value) onViewModeChange(value);
          }}
          aria-label="Library view mode"
        >
          <ToggleButton value="cards" aria-label="Card view">
            <Tooltip title="Card view">
              <ViewModuleIcon fontSize="small" />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="table" aria-label="Table view">
            <Tooltip title="Table view">
              <TableRowsIcon fontSize="small" />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Box>
        <Chip
          label="Unlinked only"
          variant={unlinkedOnly ? 'filled' : 'outlined'}
          color={unlinkedOnly ? 'primary' : 'default'}
          onClick={() => onUnlinkedOnlyChange(!unlinkedOnly)}
          size="small"
        />
      </Box>
    </Stack>
  );
}
