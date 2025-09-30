import useSWR from 'swr';
import {
  getSystemAdminDashBoard,
  getInstitutionDashBoard,
} from '../actions/dashboard';
import {
  SystemAdminDashboardDto,
  InstitutionTrendsDashboardDto,
} from '../interfaces/types';

export function useSystemDashboard() {
  return useSWR<SystemAdminDashboardDto>(
    'dashboard-system',
    getSystemAdminDashBoard
  );
}

export function useInstitutionDashboard() {
  return useSWR<InstitutionTrendsDashboardDto>(
    'dashboard-institution',
    getInstitutionDashBoard
  );
}
