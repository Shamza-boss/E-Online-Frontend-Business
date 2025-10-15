'use client';

import * as React from 'react';
import {
  Avatar,
  Box,
  CardActionArea,
  CardMedia,
  Typography,
} from '@mui/material';
import {
  StyledCard,
  StyledCardContent,
  StyledTypography,
} from '../website/components/styled/StyledComponents';

interface VideoCardThumbnailProps {
  mediaUrl?: string;
  mediaAlt?: string;
  metadataLabel?: string;
  title?: string;
  titleContent?: React.ReactNode;
  subtitle?: string;
  avatarLabel?: string;
  footerLabel?: string;
  footerAction?: React.ReactNode;
}

const VideoCardThumbnail: React.FC<VideoCardThumbnailProps> = ({
  mediaUrl,
  mediaAlt,
  metadataLabel,
  title,
  titleContent,
  subtitle,
  avatarLabel,
  footerLabel,
  footerAction,
}) => {
  const imageSrc =
    mediaUrl || 'https://picsum.photos/seed/video-card-thumbnail/800/450';
  const imageAltText = mediaAlt || 'Video thumbnail';

  const avatarInitial = (avatarLabel?.trim().charAt(0) || '?').toUpperCase();

  return (
    <StyledCard variant="outlined" tabIndex={0}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt={imageAltText}
          image={imageSrc}
          sx={{
            aspectRatio: '16 / 9',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        />

        <StyledCardContent sx={{ padding: 2 }}>
          {metadataLabel && (
            <Typography gutterBottom variant="caption" component="div">
              {metadataLabel}
            </Typography>
          )}

          {titleContent ? (
            <Box sx={{ mb: subtitle ? 1 : 0 }}>{titleContent}</Box>
          ) : (
            title && (
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
              >
                {title}
              </Typography>
            )
          )}

          {subtitle && (
            <StyledTypography
              variant="body2"
              color="text.secondary"
              gutterBottom
            >
              {subtitle}
            </StyledTypography>
          )}
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
            <Avatar sx={{ width: 24, height: 24 }}>{avatarInitial}</Avatar>
            {avatarLabel && (
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {avatarLabel}
              </Typography>
            )}
          </Box>

          {footerAction ? (
            footerAction
          ) : footerLabel ? (
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
              {footerLabel}
            </Typography>
          ) : null}
        </Box>
      </CardActionArea>
    </StyledCard>
  );
};

export default VideoCardThumbnail;
