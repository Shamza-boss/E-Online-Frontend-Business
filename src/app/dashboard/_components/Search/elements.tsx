import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';

export const SearchFormControl = styled(FormControl)({
  '& .MuiOutlinedInput-root': {
    flexGrow: 1,
    height: 20,
  },
});
