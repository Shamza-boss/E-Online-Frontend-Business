import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const BannerAlert = styled(Alert)(({ theme }) => ({
    borderRadius: Number(theme.shape.borderRadius) * 3,
}));

export const BoldAlertTitle = styled(AlertTitle)({
    fontWeight: 700,
});

export const DetailContainer = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(1),
}));

export const InstitutionBox = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(1),
}));

export const InvoiceCaption = styled(Typography)({
    display: 'block',
}) as typeof Typography;
