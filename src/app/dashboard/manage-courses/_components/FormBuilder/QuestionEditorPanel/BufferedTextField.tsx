'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TextField } from '@mui/material';
import type { BufferedTextFieldProps } from './types';

const BufferedTextField: React.FC<BufferedTextFieldProps> = ({
    value,
    onCommit,
    debounceMs = 1000,
    onBlur,
    ...rest
}) => {
    const initial = value == null ? '' : String(value);
    const [draft, setDraft] = useState<string>(initial);
    const isFocusedRef = useRef(false);
    const timeoutRef = useRef<number | null>(null);
    const latestCommitRef = useRef(onCommit);
    const latestDraftRef = useRef(draft);
    const lastCommittedRef = useRef<string>(initial);

    useEffect(() => {
        latestCommitRef.current = onCommit;
    }, [onCommit]);

    useEffect(() => {
        latestDraftRef.current = draft;
    }, [draft]);

    useEffect(() => {
        const next = value == null ? '' : String(value);
        lastCommittedRef.current = next;
        if (!isFocusedRef.current && next !== latestDraftRef.current) {
            setDraft(next);
        }
    }, [value]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            if (latestDraftRef.current !== lastCommittedRef.current) {
                lastCommittedRef.current = latestDraftRef.current;
                latestCommitRef.current(latestDraftRef.current);
            }
        };
    }, []);

    const scheduleCommit = (next: string) => {
        if (next === lastCommittedRef.current) return;
        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(() => {
            timeoutRef.current = null;
            if (next !== lastCommittedRef.current) {
                lastCommittedRef.current = next;
                latestCommitRef.current(next);
            }
        }, debounceMs);
    };

    const flushCommit = () => {
        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (latestDraftRef.current !== lastCommittedRef.current) {
            lastCommittedRef.current = latestDraftRef.current;
            latestCommitRef.current(latestDraftRef.current);
        }
    };

    return (
        <TextField
            {...rest}
            value={draft}
            onFocus={(event) => {
                isFocusedRef.current = true;
                rest.onFocus?.(event);
            }}
            onBlur={(event) => {
                isFocusedRef.current = false;
                flushCommit();
                onBlur?.(event);
            }}
            onChange={(event) => {
                const next = event.target.value;
                setDraft(next);
                scheduleCommit(next);
            }}
        />
    );
};

export default BufferedTextField;
