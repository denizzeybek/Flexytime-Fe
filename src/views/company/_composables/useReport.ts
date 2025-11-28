import { computed } from 'vue';

import { useCompanyReportsStore } from '@/stores/company/reports';
import { EGroupOptions } from '@/views/company/_etc/groupOptions.enum';

export const useReport = () => {
  const reportsStore = useCompanyReportsStore();

  const teamOptions = computed(() => {
    return reportsStore.filters?.Teams?.map((team) => ({
      name: team.Name,
      value: team.ID,
    }));
  });

  const employeeOptions = computed(() => {
    return reportsStore.filters?.Employees?.map((employee) => ({
      name: employee.Name,
      value: employee.ID,
    }));
  });

  const projectOptions = computed(() => {
    return reportsStore.filters?.Projects?.map((project) => ({
      name: project.Name,
      value: project.ID,
    }));
  });

  const billibleOptions = [
    { name: 'Billable', value: 'billable' },
    { name: 'Non-Billable', value: 'non-billable' },
  ];

  const groupOptions = [
    { value: EGroupOptions.PROJECTS, name: 'Projects' },
    { value: EGroupOptions.EMPLOYEES, name: 'Employees' },
    { value: EGroupOptions.TEAMS, name: 'Teams' },
    { value: EGroupOptions.BILLABLE, name: 'Billable' },
  ];

  return {
    teamOptions,
    employeeOptions,
    projectOptions,
    billibleOptions,
    groupOptions,
  };
};
