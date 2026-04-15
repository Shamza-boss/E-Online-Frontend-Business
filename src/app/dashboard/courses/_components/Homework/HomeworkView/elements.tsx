import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import ButtonBase from '@mui/material/ButtonBase';

/* ── Exported step pill for parent toolbar ── */
export const StepPill = styled(ButtonBase, {
    shouldForwardProp: (prop) => prop !== 'completed' && prop !== 'active',
})<{ completed: boolean; active: boolean }>(({ theme, completed, active }) => {
    const completeAlpha = theme.palette.mode === 'dark' ? 0.24 : 0.12;
    const activeAlpha = theme.palette.mode === 'dark' ? 0.28 : 0.15;

    let borderColor = alpha(theme.palette.divider, 0.95);
    let backgroundColor = theme.palette.background.paper;
    let textColor = theme.palette.text.secondary;

    if (completed) {
        borderColor = alpha(theme.palette.success.main, 0.55);
        backgroundColor = alpha(theme.palette.success.main, completeAlpha);
        textColor = theme.palette.success.main;
    }
    if (active) {
        borderColor = alpha(theme.palette.primary.main, 0.6);
        backgroundColor = alpha(theme.palette.primary.main, activeAlpha);
        textColor = theme.palette.primary.main;
    }

    return {
        height: 28,
        minWidth: 38,
        borderRadius: 999,
        paddingInline: theme.spacing(0.75),
        border: `1px solid ${borderColor}`,
        backgroundColor,
        color: textColor,
        fontWeight: 600,
        fontSize: 11,
    };
});

/* ── Page surface ── */
export const PageSurface = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.spacing(1.5),
    border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
    flex: 1,
    width: '100%',
    minHeight: 0,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
}));

/* ── Question node card ── */
export const NodeCard = styled(Paper, {
    shouldForwardProp: (prop) => prop !== 'depth',
})<{ depth: number }>(({ theme, depth }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginInlineStart: depth > 1 ? theme.spacing((depth - 1) * 2) : 0,
    borderRadius: theme.spacing(1.5),
    border: `1px solid ${alpha(theme.palette.divider, 0.95)}`,
    borderLeft: `4px solid ${alpha(theme.palette.text.secondary, theme.palette.mode === 'dark' ? 0.6 : 0.3)}`,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
}));

/* ── Full-height shell ── */
export const ViewShell = styled(Box)(() => ({
    height: '100%',
    width: '100%',
    minHeight: 0,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
}));

/* ── Footer bar ── */
export const FooterBar = styled(Paper)(({ theme }) => ({
    borderRadius: theme.spacing(1.5),
    border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
    backgroundColor: alpha(
        theme.palette.background.paper,
        theme.palette.mode === 'dark' ? 0.96 : 0.98,
    ),
    flexShrink: 0,
    width: '100%',
    padding: theme.spacing(1, 2),
    marginTop: theme.spacing(1.5),
}));

/* ── Dot stepper row ── */
export const DotStepper = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(0.5),
    overflowX: 'auto',
    overflowY: 'hidden',
    whiteSpace: 'nowrap',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
}));

/* ── Footer progress bar ── */
export const FooterProgressBar = styled(LinearProgress)(({ theme }) => ({
    height: 6,
    borderRadius: 999,
    backgroundColor: alpha(
        theme.palette.success.main,
        theme.palette.mode === 'dark' ? 0.16 : 0.12,
    ),
    '& .MuiLinearProgress-bar': { borderRadius: 999 },
}));

/* ── Flex wrap row ── */
export const FlexWrapRow = styled(Box)({
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'baseline',
});

/* ── Multi-select column ── */
export const MultiSelectColumn = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
});

/* ── Cover page hero ── */
export const HeroBox = styled(Box)(({ theme }) => ({
    borderRadius: Number(theme.shape.borderRadius) * 3,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
    paddingInline: theme.spacing(2.5),
    paddingBlock: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
        paddingInline: theme.spacing(4),
        paddingBlock: theme.spacing(4),
    },
    background:
        theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.35)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.light, 0.04)} 100%)`,
}));

/* ── Question breakdown container ── */
export const BreakdownContainer = styled(Box)(({ theme }) => ({
    borderRadius: Number(theme.shape.borderRadius) * 2.5,
    border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
    overflow: 'hidden',
}));

export const BreakdownHeader = styled(Box)(({ theme }) => ({
    paddingInline: theme.spacing(2),
    paddingBlock: theme.spacing(1.5),
    backgroundColor: alpha(
        theme.palette.text.primary,
        theme.palette.mode === 'dark' ? 0.06 : 0.03,
    ),
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
    [theme.breakpoints.up('sm')]: {
        paddingInline: theme.spacing(3),
    },
}));

/* ── Stat card for cover page ── */
export const StatCardPaper = styled(Paper, {
    shouldForwardProp: (prop) => prop !== '$color',
})<{ $color: 'primary' | 'info' | 'success' | 'warning' }>(({ theme, $color }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    paddingInline: theme.spacing(2),
    paddingBlock: theme.spacing(1.75),
    borderRadius: Number(theme.shape.borderRadius) * 2.5,
    borderColor: alpha(theme.palette[$color].main, 0.25),
    backgroundColor: alpha(
        theme.palette[$color].main,
        theme.palette.mode === 'dark' ? 0.08 : 0.04,
    ),
    [theme.breakpoints.up('sm')]: {
        paddingInline: theme.spacing(2.5),
        paddingBlock: theme.spacing(2),
    },
}));

export const StatIconCircle = styled(Box, {
    shouldForwardProp: (prop) => prop !== '$color',
})<{ $color: 'primary' | 'info' | 'success' | 'warning' }>(({ theme, $color }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 42,
    height: 42,
    borderRadius: '50%',
    backgroundColor: alpha(theme.palette[$color].main, 0.15),
    color: theme.palette[$color].main,
    flexShrink: 0,
    '& .MuiSvgIcon-root': { fontSize: 22 },
}));

/* ── Weight badge ── */
export const WeightBadge = styled(Box)(({ theme }) => ({
    marginLeft: theme.spacing(2),
    flexShrink: 0,
    paddingInline: theme.spacing(1.25),
    paddingBlock: theme.spacing(0.25),
    borderRadius: Number(theme.shape.borderRadius),
    fontSize: '0.8rem',
    fontWeight: 600,
    backgroundColor: alpha(theme.palette.success.main, 0.1),
    color: theme.palette.success.main,
}));

/* ── Cover page content area ── */
export const CoverScrollArea = styled(Box)(({ theme }) => ({
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBlock: theme.spacing(2),
    paddingInline: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
        paddingInline: theme.spacing(2),
    },
    [theme.breakpoints.up('md')]: {
        paddingBlock: theme.spacing(4),
    },
}));

/* ── Question scroll area ── */
export const QuestionScrollBox = styled(Box)(({ theme }) => ({
    flex: 1,
    minHeight: 0,
    minWidth: 0,
    overflowY: 'auto',
    paddingRight: theme.spacing(0.5),
}));

/* ── Stat cards grid ── */
export const StatCardsGrid = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: theme.spacing(1.5),
    [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: theme.spacing(2),
    },
}));

/* ── Answer area ── */
export const AnswerArea = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(1.5),
}));

/* ── Video wrapper ── */
export const VideoWrapper = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
}));

/* ── PDF viewer flex box ── */
export const PdfViewerBox = styled(Box)({
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
});

/* ── Nav button ── */
export const NavIconButton = styled(Box)(({ theme }) => ({
    border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
    borderRadius: Number(theme.shape.borderRadius),
    padding: theme.spacing(0.5),
}));
