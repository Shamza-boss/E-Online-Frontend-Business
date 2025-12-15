'use client';
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function FAQ() {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Container
      id="faq"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Typography
        component="h2"
        variant="h4"
        sx={{
          color: 'text.primary',
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
        }}
      >
        Frequently asked questions
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Accordion
          expanded={expanded === 'panel1'}
          onChange={handleChange('panel1')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel1d-header">
            <Typography component="h3" variant="subtitle2">
              Is E-Online free to use?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              sx={{ maxWidth: { sm: '100%', md: '70%' } }}
            >
              E-Online is a paid platform built for sustainable, high-quality
              education. We offer flexible pricing tiers for individuals,
              educators, and institutions—coming soon.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expanded === 'panel2'}
          onChange={handleChange('panel2')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel2d-header">
            <Typography component="h3" variant="subtitle2">
              Who can use E-Online?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              sx={{ maxWidth: { sm: '100%', md: '70%' } }}
            >
              Our platform is built for trainers, trainees, tutors, and academic
              institutions. Whether you manage classrooms or study
              independently, E-Online adapts to your goals.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expanded === 'panel3'}
          onChange={handleChange('panel3')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel3d-header">
            <Typography component="h3" variant="subtitle2">
              Can trainees submit assignments through the platform?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              sx={{ maxWidth: { sm: '100%', md: '70%' } }}
            >
              Yes. Trainers can create structured assignments, and trainees can
              complete and submit their work directly through the platform.
              Trainers can then review, grade, and comment—all in one place.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expanded === 'panel4'}
          onChange={handleChange('panel4')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel4d-header">
            <Typography component="h3" variant="subtitle2">
              Does E-Online work offline?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              sx={{ maxWidth: { sm: '100%', md: '70%' } }}
            >
              No, E-Online is a web-based platform that requires an active
              internet connection to navigate, access content, and submit
              assignments.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expanded === 'panel5'}
          onChange={handleChange('panel5')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel5d-header">
            <Typography component="h3" variant="subtitle2">
              Can I use E-Online with my school?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              sx={{ maxWidth: { sm: '100%', md: '70%' } }}
            >
              Absolutely. We&apos;re actively onboarding schools and educators.
              If you&apos;d like to set up E-Online for your institution, reach
              out to us to learn about pricing and deployment support.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
}
