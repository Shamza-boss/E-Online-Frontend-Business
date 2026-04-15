'use client';

import React, { useState } from 'react';
import {
    CircularProgress,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SendIcon from '@mui/icons-material/Send';
import PaidIcon from '@mui/icons-material/Paid';
import DownloadIcon from '@mui/icons-material/Download';
import CancelIcon from '@mui/icons-material/Cancel';
import UndoIcon from '@mui/icons-material/Undo';
import VisibilityIcon from '@mui/icons-material/Visibility';
import type { InvoiceActionsMenuProps } from './interfaces';
import { canSend, canPay, canCancel, canUnpay } from './utils';
import { CancelMenuItem } from './elements';

export default function InvoiceActionsMenu({
    invoice,
    onSend,
    onMarkPaid,
    onDownloadPdf,
    onCancel,
    onUnpay,
    onViewDetail,
}: InvoiceActionsMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [loading, setLoading] = useState<string | null>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const close = () => setAnchorEl(null);

    const withLoading = (key: string, fn: () => Promise<void>) => async () => {
        setLoading(key);
        try {
            await fn();
        } finally {
            setLoading(null);
            close();
        }
    };

    const status = invoice.status;

    return (
        <>
            <IconButton size="small" onClick={handleClick} aria-label="Invoice actions">
                <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={close}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={() => { onViewDetail(invoice); close(); }}>
                    <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>View Details</ListItemText>
                </MenuItem>

                {canSend(status) && (
                    <MenuItem onClick={() => { onSend(invoice); close(); }}>
                        <ListItemIcon><SendIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>{status === 'Sent' ? 'Resend Invoice' : 'Send Invoice'}</ListItemText>
                    </MenuItem>
                )}

                {canPay(status) && (
                    <MenuItem onClick={() => { onMarkPaid(invoice); close(); }}>
                        <ListItemIcon><PaidIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>Mark as Paid</ListItemText>
                    </MenuItem>
                )}

                <MenuItem
                    onClick={withLoading('pdf', () => onDownloadPdf(invoice))}
                    disabled={loading === 'pdf'}
                >
                    <ListItemIcon>
                        {loading === 'pdf' ? <CircularProgress size={18} /> : <DownloadIcon fontSize="small" />}
                    </ListItemIcon>
                    <ListItemText>Download PDF</ListItemText>
                </MenuItem>

                {canUnpay(status) && (
                    <MenuItem
                        onClick={withLoading('unpay', () => onUnpay(invoice))}
                        disabled={loading === 'unpay'}
                    >
                        <ListItemIcon>
                            {loading === 'unpay' ? <CircularProgress size={18} /> : <UndoIcon fontSize="small" />}
                        </ListItemIcon>
                        <ListItemText>Undo Payment</ListItemText>
                    </MenuItem>
                )}

                {canCancel(status) && (
                    <CancelMenuItem
                        onClick={withLoading('cancel', () => onCancel(invoice))}
                        disabled={loading === 'cancel'}
                    >
                        <ListItemIcon>
                            {loading === 'cancel' ? <CircularProgress size={18} /> : <CancelIcon fontSize="small" color="error" />}
                        </ListItemIcon>
                        <ListItemText>Cancel Invoice</ListItemText>
                    </CancelMenuItem>
                )}
            </Menu>
        </>
    );
}
