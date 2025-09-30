'use client';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CalculateIcon from '@mui/icons-material/Calculate';
import { Avatar, Box, CardActionArea, CardMedia } from '@mui/material';
import {
  StyledCard,
  StyledCardContent,
  StyledTypography,
} from '../../website/components/styled/StyledComponents';

interface ClassCardProps {
  className: string;
  academicLevelName: string;
  subjectName: string;
  teacherNameAbb: string;
}

export default function ClassCard({
  className,
  academicLevelName,
  subjectName,
  teacherNameAbb,
}: ClassCardProps) {
  return (
    <StyledCard variant="outlined" tabIndex={0}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt={`${className} image`}
          image={`https://picsum.photos/seed/${subjectName}/800/450`}
          sx={{
            aspectRatio: '16 / 9',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        />
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
            padding: '16px',
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
            <Avatar alt={teacherNameAbb} sx={{ width: 24, height: 24 }} />

            <Typography variant="caption">{teacherNameAbb}</Typography>
          </Box>

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
      </CardActionArea>
    </StyledCard>
  );
}
