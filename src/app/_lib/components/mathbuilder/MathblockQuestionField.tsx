import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import dynamic from 'next/dynamic';

// Dynamically load MathJax without SSR to prevent hydration issues
const MathJax = dynamic(
  () => import('better-react-mathjax').then((mod) => mod.MathJax),
  { ssr: false }
);

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export const MathBlockQuestionField: React.FC<Props> = ({
  value,
  onChange,
}) => {
  const [latex, setLatex] = useState(value || '');

  useEffect(() => {
    onChange(latex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latex]);

  const renderedLatex =
    latex.includes('$$') || latex.includes('\\(') ? latex : `$$${latex}$$`;

  return (
    <Box mt={2}>
      <TextField
        label="Math Question (LaTeX)"
        multiline
        rows={4}
        fullWidth
        value={latex}
        onChange={(e) => setLatex(e.target.value)}
        placeholder="Enter LaTeX like: $$x = {-b \\pm \\sqrt{b^2 - 4ac} \\over 2a}$$"
      />
      <Box
        m={2}
        p={1}
        border="1px dashed grey"
        borderRadius={1}
        bgcolor="#f9f9f9"
        color={'black'}
      >
        <Typography variant="subtitle2" gutterBottom>
          Live Preview:
        </Typography>
        <MathJax dynamic>{renderedLatex}</MathJax>
      </Box>
    </Box>
  );
};
