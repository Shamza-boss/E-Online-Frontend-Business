'use client';

import { Step, StepLabel, Stepper } from '@mui/material';
import { BUILDER_STEPS } from '../constants';
import { StepperContainer } from '../elements';

interface FormBuilderStepperProps {
  activeStep: number;
}

export default function FormBuilderStepper({ activeStep }: FormBuilderStepperProps) {
  return (
    <StepperContainer>
      <Stepper activeStep={activeStep}>
        {BUILDER_STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </StepperContainer>
  );
}
