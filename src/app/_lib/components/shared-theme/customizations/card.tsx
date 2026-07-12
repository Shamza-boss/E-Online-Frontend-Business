'use client';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Avatar, Box, CardActionArea, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import CalculateIcon from '@mui/icons-material/Calculate';
import ScienceIcon from '@mui/icons-material/Science';
import CodeIcon from '@mui/icons-material/Code';
import TranslateIcon from '@mui/icons-material/Translate';
import PaletteIcon from '@mui/icons-material/Palette';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SchoolIcon from '@mui/icons-material/School';
import {
  StyledCard,
  StyledCardContent,
  StyledTypography,
} from '../../website/components/styled/StyledComponents';
import { getSubjectTheme, getSubjectIconType, type SubjectIconType } from '@/app/_lib/utils/subjectTheme';

type ClassCardProps = {
  className: string;
  academicLevelName: string;
  subjectName: string;
  teacherNameAbb: string;
}

// Icon mapping based on subject type
const SubjectIconMap: Record<SubjectIconType, React.ElementType> = {
  calculate: CalculateIcon,
  science: ScienceIcon,
  code: CodeIcon,
  translate: TranslateIcon,
  palette: PaletteIcon,
  history_edu: HistoryEduIcon,
  business: BusinessCenterIcon,
  fitness: FitnessCenterIcon,
  school: SchoolIcon,
};

export default function ClassCard({
  className,
  academicLevelName,
  subjectName,
  teacherNameAbb,
}: ClassCardProps) {
  const theme = useTheme();
  const { gradient, accent } = getSubjectTheme(subjectName);
  const iconType = getSubjectIconType(subjectName);
  const IconComponent = SubjectIconMap[iconType];

  return (
    <StyledCard 
      variant="outlined" 
      tabIndex={0}
      sx={{
        borderWidth: 1.5,
        borderColor: alpha(accent, 0.25),
        borderRadius: 3,
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          borderColor: alpha(accent, 0.5),
          backgroundColor: alpha(accent, 0.02),
          boxShadow: `0 4px 20px ${alpha(accent, 0.12)}`,
          transform: 'translateY(-3px)',
        },
      }}
    >
      <CardActionArea sx={{ borderRadius: 2.5 }}>
        {/* Gradient background with icon */}
        <Box
          sx={{
            aspectRatio: '16 / 9',
            background: gradient,
            borderBottom: '1px solid',
            borderColor: alpha(accent, 0.2),
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Rocket texture - soft AO Launchpad branding */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(/assets/absolute-rocket.webp)',
              backgroundRepeat: 'repeat',
              backgroundSize: '40px 40px',
              opacity: 0.08,
              filter: 'grayscale(100%)',
              transform: 'rotate(45deg) scale(1.2)',
              transformOrigin: 'center center',
            }}
          />
          
          {/* Decorative background pattern */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              opacity: 0.1,
              background: `
                radial-gradient(circle at 20% 20%, white 1px, transparent 1px),
                radial-gradient(circle at 80% 80%, white 1px, transparent 1px),
                radial-gradient(circle at 40% 70%, white 1px, transparent 1px),
                radial-gradient(circle at 70% 30%, white 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />
          
          {/* Floating icon */}
          <Box
            sx={{
              p: 2.5,
              borderRadius: '50%',
              background: alpha('#fff', 0.2),
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 32px ${alpha('#000', 0.1)}`,
            }}
          >
            <IconComponent 
              sx={{ 
                fontSize: 48, 
                color: '#fff',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
              }} 
            />
          </Box>
        </Box>

        <StyledCardContent sx={{ padding: 2 }}>
          <Typography gutterBottom variant="caption" component="div">
            {academicLevelName}
          </Typography>

          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
          >
            {className}
          </Typography>

          <StyledTypography variant="body2" color="text.secondary" gutterBottom>
            {`Join ${teacherNameAbb}'s ${subjectName} class for ${academicLevelName} learners. Dive into ${subjectName} through interactive lessons and resources.`}
          </StyledTypography>
        </StyledCardContent>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px 20px',
            borderTop: '1px solid',
            borderColor: alpha(accent, 0.1),
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Avatar 
              alt={teacherNameAbb} 
              sx={{ 
                width: 24, 
                height: 24,
                bgcolor: accent,
                fontSize: '0.75rem',
              }}
            >
              {teacherNameAbb.charAt(0)}
            </Avatar>

            <Typography variant="caption">{teacherNameAbb}</Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <IconComponent sx={{ fontSize: 16, color: accent }} />
            <Typography
              component="div"
              noWrap
              variant="body2"
              sx={{
                color: 'text.secondary',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              {subjectName}
            </Typography>
          </Box>
        </Box>
      </CardActionArea>
    </StyledCard>
  );
}
