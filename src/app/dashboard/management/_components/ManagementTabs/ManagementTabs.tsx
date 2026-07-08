'use client';

import { Tab } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import DataGridTabPanel from '@/app/_lib/components/tabs/DataGridTabPanel';
import UserManagementDataGrid from '../UserManagementDataGrid';
import ClassManagementDataGrid from '../ClassManagementDataGrid';
import type { ManagementTabsProps } from './interfaces';
import {
  TAB_ARIA_LABEL,
  TAB_COURSES,
  TAB_COURSES_LABEL,
  TAB_USERS,
  TAB_USERS_LABEL,
} from './constants';
import { TabListContainer, TabPanelContainer } from './elements';

export default function ManagementTabs({
  activeTab,
  onTabChange,
  searchTerm,
  initialAcademics,
  initialSubjects,
}: ManagementTabsProps) {
  return (
    <TabContext value={activeTab}>
      <TabListContainer>
        <TabList onChange={onTabChange} aria-label={TAB_ARIA_LABEL}>
          <Tab
            icon={<PeopleIcon />}
            iconPosition="start"
            label={TAB_USERS_LABEL}
            value={TAB_USERS}
          />
          <Tab
            icon={<SchoolIcon />}
            iconPosition="start"
            label={TAB_COURSES_LABEL}
            value={TAB_COURSES}
          />
        </TabList>
      </TabListContainer>
      <DataGridTabPanel value={TAB_USERS} sx={{ flex: 1 }}>
        <TabPanelContainer>
          <UserManagementDataGrid
            active={activeTab === TAB_USERS}
            searchTerm={searchTerm}
          />
        </TabPanelContainer>
      </DataGridTabPanel>
      <DataGridTabPanel value={TAB_COURSES} sx={{ flex: 1 }}>
        <TabPanelContainer>
          <ClassManagementDataGrid
            active={activeTab === TAB_COURSES}
            searchTerm={searchTerm}
            initialAcademics={initialAcademics}
            initialSubjects={initialSubjects}
          />
        </TabPanelContainer>
      </DataGridTabPanel>
    </TabContext>
  );
}
