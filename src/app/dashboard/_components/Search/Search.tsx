'use client';

import * as React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useSearchContext } from '@/app/_lib/context/SearchContext';
import { SEARCH_INPUT_ID, SEARCH_WIDTH } from './constants';
import { SearchFormControl } from './elements';

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
    [setSearchTerm],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape' && enabled) {
        event.preventDefault();
        setInputValue('');
        setSearchTerm('');
      }
    },
    [enabled, setSearchTerm],
  );

  if (!enabled) {
    return null;
  }

  return (
    <SearchFormControl sx={{ width: SEARCH_WIDTH }} variant="outlined">
      <OutlinedInput
        id={SEARCH_INPUT_ID}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={!enabled}
        startAdornment={
          <InputAdornment position="start" sx={{ color: 'text.primary' }}>
            <SearchRoundedIcon />
          </InputAdornment>
        }
        inputProps={{
          'aria-label': enabled ? placeholder : 'search unavailable',
        }}
      />
    </SearchFormControl>
  );
}
