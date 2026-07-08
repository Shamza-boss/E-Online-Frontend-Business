import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { CARD_TITLE, CARD_DESCRIPTION, CARD_ACTION_LABEL } from './constants';
import { AlertCard } from './elements';

export default function CardAlert() {
  return (
    <AlertCard variant="outlined">
      <CardContent>
        <AutoAwesomeRoundedIcon fontSize="small" />
        <Typography gutterBottom sx={{ fontWeight: 600 }}>
          {CARD_TITLE}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          {CARD_DESCRIPTION}
        </Typography>
        <Button variant="contained" size="small" fullWidth>
          {CARD_ACTION_LABEL}
        </Button>
      </CardContent>
    </AlertCard>
  );
}
