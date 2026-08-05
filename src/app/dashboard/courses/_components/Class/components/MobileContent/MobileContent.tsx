import React from 'react';
import type { MobileContentProps } from './types';
import { FlexOutlinedWrapper } from './elements';

export const MobileContent: React.FC<MobileContentProps> = ({
    notesOpen,
    notesPanel,
    renderTabs,
}) => {
    if (notesOpen) {
        return <>{notesPanel}</>;
    }

    return (
        <FlexOutlinedWrapper>
            {renderTabs()}
        </FlexOutlinedWrapper>
    );
};
