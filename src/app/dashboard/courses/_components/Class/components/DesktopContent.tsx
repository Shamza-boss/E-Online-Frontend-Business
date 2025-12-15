import React from 'react';
import Splitter from '@devbookhq/splitter';
import { OutlinedWrapper } from '@/app/_lib/components/shared-theme/customizations/OutlinedWrapper';

interface DesktopContentProps {
    notesOpen: boolean;
    notesPanel: React.ReactNode;
    renderTabs: () => React.ReactNode;
    splitSizes: number[];
    onSplitResizeFinished: (gutterIdx: number, sizes: number[]) => void;
}

export const DesktopContent: React.FC<DesktopContentProps> = ({
    notesOpen,
    notesPanel,
    renderTabs,
    splitSizes,
    onSplitResizeFinished,
}) => {
    const tabSection = (
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

    if (!notesOpen) {
        return tabSection;
    }

    return (
        <Splitter
            gutterClassName="custom-gutter-horizontal"
            draggerClassName="custom-dragger-horizontal"
            initialSizes={splitSizes}
            onResizeFinished={onSplitResizeFinished}
        >
            {notesPanel}
            {tabSection}
        </Splitter>
    );
};
