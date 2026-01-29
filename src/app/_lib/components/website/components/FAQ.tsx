'use client';
import * as React from 'react';
import { motion } from 'framer-motion';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MotionBox = motion.create(Box);

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What is AO Launchpad and who is it for?',
    answer:
      'AO Launchpad is a private corporate Learning Management System (LMS) by Absolute Online—think of it as your organization\'s own Udemy. It serves enterprises needing to train employees with proprietary content that stays within your organization. Perfect for call centers, sales teams, compliance training, onboarding programs, and professional development. Only your employees can access your courses.',
  },
  {
    question: 'How does the assessment and certification system work?',
    answer:
      'Managers and L&D teams can create structured training modules with multiple question types including single-select, multi-select, video assessments, and document-based evaluations. Each assessment supports weighted scoring for flexible competency tracking. Employees complete certifications directly on the platform, with automatic progress tracking, completion certificates, and performance analytics.',
  },
  {
    question: 'What makes the content creation tools special?',
    answer:
      'Our content editor is powered by Tiptap, a modern rich-text platform supporting full formatting, embedded diagrams via Excalidraw for process flows and org charts, and document linking. Training managers can create interactive materials, embed policy documents, and link directly to specific pages in procedure manuals—all within a unified workspace.',
  },
  {
    question: 'How do you handle video training content?',
    answer:
      'Video streaming is powered by Cloudflare Stream with enterprise-grade infrastructure. Adaptive bitrate ensures smooth playback on any connection—critical for remote workers. All videos are delivered via global CDN and secured with signed URLs, ensuring your proprietary training content is protected from unauthorized access.',
  },
  {
    question: 'Is our training content secure and private?',
    answer:
      'Absolutely. AO Launchpad is designed for organizational privacy. Your content is completely isolated—no other company can see or access your courses. We use role-based access control, encrypted data storage, and enterprise authentication. You control who sees what: restrict content by department, role, or team.',
  },
  {
    question: 'Can AO Launchpad adapt to our company\'s structure?',
    answer:
      'Yes. Create custom departments, teams, job roles, and training tracks that mirror your organization. Assign regional managers, department heads, and trainers with appropriate permissions. Whether you\'re a 50-person startup or a 10,000-employee enterprise, AO Launchpad scales to your org chart.',
  },
  {
    question: 'What training programs can we create?',
    answer:
      'Any program your business needs: Call Center Agent Certification, Sales Methodology Training, Compliance & Regulatory Programs, Software Onboarding, Leadership Development, Safety Protocols, Customer Service Excellence, Technical Skills Training, and more. You own the curriculum—we provide the platform.',
  },
  {
    question: 'How do we get started?',
    answer:
      'Contact our team for a demo tailored to your industry. We\'ll help you migrate existing content, set up your organizational structure, train your administrators, and launch your first training programs. Most companies are fully operational within 2-4 weeks.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export default function FAQ() {
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Box
      id="faq"
      sx={{
        py: { xs: 10, sm: 16 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorations */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '-5%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: theme.palette.mode === 'dark'
            ? `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`
            : `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 70%)`,
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          sx={{
            textAlign: 'center',
            mb: { xs: 6, sm: 8 },
          }}
        >
          <Typography
            component="span"
            variant="overline"
            sx={{
              color: 'primary.main',
              fontWeight: 700,
              letterSpacing: 2,
              mb: 1,
              display: 'block',
            }}
          >
            Got Questions?
          </Typography>
          <Typography
            component="h2"
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              fontWeight: 400,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Everything you need to know about AO Launchpad. Can't find the answer you're looking for?
            Reach out to our team.
          </Typography>
        </MotionBox>

        <MotionBox
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {faqs.map((faq, index) => (
            <MotionBox key={index} variants={itemVariants}>
              <Accordion
                expanded={expanded === `panel${index}`}
                onChange={handleChange(`panel${index}`)}
                sx={{
                  mb: 2,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: expanded === `panel${index}` ? 'primary.main' : 'divider',
                  boxShadow: 'none',
                  '&:before': {
                    display: 'none',
                  },
                  '&:first-of-type': {
                    borderRadius: 3,
                  },
                  '&:last-of-type': {
                    borderRadius: 3,
                  },
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  bgcolor: expanded === `panel${index}`
                    ? alpha(theme.palette.primary.main, 0.02)
                    : 'background.paper',
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      sx={{
                        color: expanded === `panel${index}` ? 'primary.main' : 'text.secondary',
                        transition: 'color 0.3s ease',
                      }}
                    />
                  }
                  sx={{
                    px: 3,
                    py: 1,
                    '& .MuiAccordionSummary-content': {
                      my: 2,
                    },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: expanded === `panel${index}` ? 'primary.main' : 'text.primary',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.8,
                    }}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </MotionBox>
          ))}
        </MotionBox>
      </Container>
    </Box>
  );
}
