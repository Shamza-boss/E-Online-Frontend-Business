import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Grid } from '@mui/material';

export default function StudentClassCardSkeleton({
  count = 4, // Default count to 4 if not provided
}: {
  count: Number | undefined;
}) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {[...Array(count)].map((_, idx) => (
          <Grid key={idx} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ width: '100%', padding: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 194, // matches CalculateIcon size in ClassCard
                  width: '100%',
                  backgroundColor: '#5d99a8',
                }}
              >
                <Skeleton
                  variant="circular"
                  width={120}
                  height={120}
                  sx={{ bgcolor: '#7fbac9' }}
                />
              </Box>
              <CardContent sx={{ padding: 2 }}>
                <Skeleton
                  variant="text"
                  width="60%"
                  height={32}
                  sx={{ mb: 1 }}
                />
                <Skeleton
                  variant="text"
                  width="40%"
                  height={24}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Skeleton variant="text" width="40%" height={20} />
                  <Skeleton variant="text" width="30%" height={20} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
