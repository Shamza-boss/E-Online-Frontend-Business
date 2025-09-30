'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/system';
import Image from 'next/image';

const placeholderLogos = [
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560628889c3bdf1129952dc_Sydney-black.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f4d4d8b829a89976a419c_Bern-black.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f467502f091ccb929529d_Montreal-black.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e911fa22f2203d7514c_TerraDark.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560a0990f3717787fd49245_colorado-black.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f5ca4e548b0deb1041c33_Ankara-black.svg',
];

const logoStyle = {
  width: '100px',
  height: '80px',
  margin: '0 32px',
  opacity: 0.5,
  filter: 'grayscale(100%)',
};

export default function LogoCollection() {
  const theme = useTheme();
  const logos = placeholderLogos;

  return (
    <Box id="logoCollection" sx={{ py: 4 }}>
      <Typography
        component="p"
        variant="subtitle2"
        align="center"
        sx={{ color: 'text.secondary', mb: 2 }}
      >
        This space is reserved for our future partners.
      </Typography>
      <Typography
        component="p"
        variant="body2"
        align="center"
        sx={{ color: 'text.disabled', mb: 1 }}
      >
        Are you an educator or institution looking to shape the future of
        learning?
        <br />
        Be among the first to join us.
      </Typography>
      <Grid container sx={{ justifyContent: 'center', opacity: 0.4 }}>
        {logos.map((logo, index) => (
          <Image
            key={index}
            src={logo}
            alt={`Future partner logo ${index + 1}`}
            width={100}
            height={50}
            style={logoStyle}
            unoptimized
          />
        ))}
      </Grid>
    </Box>
  );
}
