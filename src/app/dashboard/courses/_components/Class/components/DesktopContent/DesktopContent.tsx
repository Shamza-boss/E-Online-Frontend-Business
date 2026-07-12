import React from 'react';
import Splitter from '@devbookhq/splitter';
import type { DesktopContentProps } from './types';
import { FlexOutlinedWrapper } from './elements';

export const DesktopContent: React.FC<DesktopContentProps> = ({
    notesOpen,
    notesPanel,
    renderTabs,
    splitSizes,
    onSplitResizeFinished,
}) => {
    const tabSection = (
        <FlexOutlinedWrapper>
            {renderTabs()}
        </FlexOutlinedWrapper>
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
