'use client';

import { Box, Tab } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import DataGridTabPanel from '@/app/_lib/components/tabs/DataGridTabPanel';
import UserManagementDataGrid from './Tables/userManagementDataGrid';
import ClassManagementDataGrid from './Tables/classManagementDataGrid';

interface ManagementTabsProps {
    activeTab: string;
    onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
}

export default function ManagementTabs({
    activeTab,
    onTabChange,
}: ManagementTabsProps) {
    return (
        <TabContext value={activeTab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={onTabChange} aria-label="management tabs">
                    <Tab label="People" value="1" />
                    <Tab label="Courses" value="2" />
                </TabList>
            </Box>
            <DataGridTabPanel value="1" sx={{ flex: 1 }}>
                <Box sx={{ flex: 1, display: 'flex', minHeight: 0 }}>
                    <UserManagementDataGrid active={activeTab === '1'} />
                </Box>
            </DataGridTabPanel>
            <DataGridTabPanel value="2" sx={{ flex: 1 }}>
                <Box sx={{ flex: 1, display: 'flex', minHeight: 0 }}>
                    <ClassManagementDataGrid active={activeTab === '2'} />
                </Box>
            </DataGridTabPanel>
        </TabContext>
    );
}
