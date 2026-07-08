'use client';

import {
  FormControl,
  IconButton,
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
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
  SEARCH_PLACEHOLDER,
  GRADE_FILTER_LABEL,
  ALL_GRADES_LABEL,
  UNLINKED_FILTER_TOOLTIP,
} from './constants';
import type { LibraryToolbarProps, LibraryViewMode } from './interfaces';

export type { LibraryViewMode };

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
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={1.5}
      alignItems={{ xs: 'stretch', md: 'center' }}
      sx={{ mb: 3 }}
    >
      <TextField
        size="small"
        placeholder={SEARCH_PLACEHOLDER}
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

      <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
        <FormControl size="small" sx={{ minWidth: { md: 180 } }}>
          <InputLabel id="library-grade-filter">{GRADE_FILTER_LABEL}</InputLabel>
          <Select
            labelId="library-grade-filter"
            label={GRADE_FILTER_LABEL}
            value={academicLevelId}
            onChange={(e) => onAcademicLevelChange(e.target.value)}
          >
            <MenuItem value="">{ALL_GRADES_LABEL}</MenuItem>
            {academicOptions.map((level) => (
              <MenuItem key={level.id} value={level.id}>
                {level.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Tooltip title={UNLINKED_FILTER_TOOLTIP}>
          <IconButton
            size="small"
            aria-label="Unlinked only filter"
            aria-pressed={unlinkedOnly}
            onClick={() => onUnlinkedOnlyChange(!unlinkedOnly)}
            color={unlinkedOnly ? 'primary' : 'default'}
            sx={{
              border: 1,
              borderColor: unlinkedOnly ? 'primary.main' : 'divider',
              borderRadius: 1,
              width: 40,
              height: 40,
            }}
          >
            <FilterAltIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      <ToggleButtonGroup
        size="small"
        exclusive
        value={viewMode}
        onChange={(_, value: LibraryViewMode | null) => {
          if (value) onViewModeChange(value);
        }}
        aria-label="Library view mode"
        sx={{ flexShrink: 0 }}
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
  );
}
