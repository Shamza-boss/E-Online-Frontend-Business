import React from 'react';
import { Slide } from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';

export const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<unknown> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
