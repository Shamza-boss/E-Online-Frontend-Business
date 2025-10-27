'use client';

import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useSearchContext } from '@/app/_lib/context/SearchContext';
import { height } from '@mui/system';

export default function Search() {
  const {
    state: { placeholder, searchTerm, enabled },
    setSearchTerm,
  } = useSearchContext();
  const [inputValue, setInputValue] = React.useState(searchTerm);

  React.useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setInputValue(value);
      setSearchTerm(value);
    },
    [setInputValue, setSearchTerm]
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape' && enabled) {
        event.preventDefault();
        setInputValue('');
        setSearchTerm('');
      }
    },
    [enabled, setInputValue, setSearchTerm]
  );

  if (!enabled) {
    return null;
  }

  return (
    <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
      <OutlinedInput
        id="dashboard-global-search"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={!enabled}
        sx={{ flexGrow: 1, height: 20 }}
        startAdornment={
          <InputAdornment position="start" sx={{ color: 'text.primary' }}>
            <SearchRoundedIcon />
          </InputAdornment>
        }
        inputProps={{
          'aria-label': enabled ? placeholder : 'search unavailable',
        }}
      />
    </FormControl>
  );
}
