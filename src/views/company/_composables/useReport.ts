import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { type MessageSchema } from '@/plugins/i18n';
import { useCompanyReportsStore } from '@/stores/company/reports';
import { EGroupOptions } from '@/views/company/_etc/groupOptions.enum';

export enum EBillableOptions {
  ALL = '',
  BILLABLE = '1',
  NON_BILLABLE = '0',
}

export const useReport = () => {
  const reportsStore = useCompanyReportsStore();
  const { t } = useI18n<{ message: MessageSchema }>();

  const teamOptions = computed(() => {
    return (
      reportsStore.filters?.Teams?.map((team) => ({
        name: team.Name ?? '',
        value: team.ID ?? '',
      })) ?? []
    );
  });

  const employeeOptions = computed(() => {
    return (
      reportsStore.filters?.Employees?.map((employee) => ({
        name: employee.Name ?? '',
        value: employee.ID ?? '',
      })) ?? []
    );
  });

  const projectOptions = computed(() => {
    return (
      reportsStore.filters?.Projects?.map((project) => ({
        name: project.Name ?? '',
        value: project.ID ?? '',
      })) ?? []
    );
  });

  const billableOptions = computed(() => [
    { name: t('pages.company.reports.elasticReports.billable.all'), value: EBillableOptions.ALL },
    { name: t('pages.company.reports.elasticReports.billable.billable'), value: EBillableOptions.BILLABLE },
    { name: t('pages.company.reports.elasticReports.billable.nonBillable'), value: EBillableOptions.NON_BILLABLE },
  ]);

  const groupOptions = computed(() => [
    { name: t('pages.company.reports.elasticReports.groups.projects'), value: EGroupOptions.PROJECTS },
    { name: t('pages.company.reports.elasticReports.groups.employees'), value: EGroupOptions.EMPLOYEES },
    { name: t('pages.company.reports.elasticReports.groups.teams'), value: EGroupOptions.TEAMS },
    { name: t('pages.company.reports.elasticReports.groups.billable'), value: EGroupOptions.BILLABLE },
  ]);

  return {
    teamOptions,
    employeeOptions,
    projectOptions,
    billableOptions,
    groupOptions,
    EGroupOptions,
    EBillableOptions,
  };
};
