import React from 'react';
import { OutlinedWrapper } from '@/app/_lib/components/shared-theme/customizations/OutlinedWrapper';

interface MobileContentProps {
    notesOpen: boolean;
    notesPanel: React.ReactNode;
    renderTabs: () => React.ReactNode;
}

export const MobileContent: React.FC<MobileContentProps> = ({
    notesOpen,
    notesPanel,
    renderTabs,
}) => {
    if (notesOpen) {
        return <>{notesPanel}</>;
    }

    return (
        <OutlinedWrapper
            sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                minHeight: 0,
                overflow: 'hidden',
            }}
        >
            {renderTabs()}
        </OutlinedWrapper>
    );
};
