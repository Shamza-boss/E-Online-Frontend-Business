import { useTheme, Theme } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';

export const GutterStyles = () => {
  const theme = useTheme<Theme>();
  return (
    <GlobalStyles
      styles={{
        '.custom-gutter-horizontal': {
          padding: '0 1px !important',
          margin: '0 5px !important',
          height: '100px !important',
          width: '5px !important',
          alignSelf: 'center  !important',
          borderRadius: '100px',
          backgroundColor: `${
            theme.palette.mode === 'dark' ? 'white' : 'black'
          } !important`,
          '&:hover': {
            cursor: 'col-resize !important',
          },
        },
        '.custom-dragger-horizontal': {
          display: 'none !important',
        },
      }}
    />
  );
};
