<template>
  <Dialog
    v-model:visible="open"
    modal
    :header="t('pages.hrSettings.employees.modal.header')"
    class="lg:!w-[700px] !w-full"
    :style="{ width: '50rem' }"
  >
    <template v-if="isOnMounted">
      <Tabs v-model:value="activeTab">
        <div class="!flex !justify-center">
          <TabList>
            <Tab :value="0">{{ t('pages.hrSettings.employees.modal.tab.employee') }}</Tab>
            <Tab :value="1">{{ t('pages.hrSettings.employees.modal.tab.teamManager') }}</Tab>
            <Tab :value="2">{{ t('pages.hrSettings.employees.modal.tab.systemAdmin') }}</Tab>
          </TabList>
        </div>
        <TabPanels>
          <!-- Employee Tab -->
          <TabPanel :value="0">
            <form v-if="!isEditing" class="flex flex-col gap-5" @submit.prevent>
              values.emails {{ values.emails }}
              <FEmailList name="emails" type="text" :is-clear="isClear" />
            </form>
            <form v-else class="flex flex-col gap-4">
              <EmployeeBasicInfoSection :show-enabled="isEditing" />
              <EmployeeRoleSection
                :title-options="titleOptions"
                :team-options="teamOptions"
                :show-operating-user="true"
              />
              <EmployeeTagsSalarySection :tag-options="tagOptions" :show-tags="true" />
              <Divider />
              <EmployeePasswordSection />
            </form>
          </TabPanel>

          <!-- Team Manager Tab -->
          <TabPanel :value="1">
            <form class="flex flex-col gap-6">
              <EmployeeBasicInfoSection :show-enabled="isEditing" />
              <EmployeeRoleSection
                :title-options="titleOptions"
                :team-options="teamOptions"
                :show-operating-user="false"
              />
              <EmployeeTagsSalarySection :tag-options="tagOptions" :show-tags="false" />
              <Divider />
              <EmployeePasswordSection />
            </form>
          </TabPanel>

          <!-- System Admin Tab -->
          <TabPanel :value="2">
            <form class="flex flex-col gap-6">
              <EmployeeBasicInfoSection :show-enabled="isEditing" />
              <Divider />
              <EmployeePasswordSection />
            </form>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </template>
    <div class="flex justify-end gap-2">
      <Button
        type="button"
        :label="t('common.buttons.cancel')"
        severity="secondary"
        @click.stop="open = false"
      />
      <Button
        type="submit"
        :label="t('common.buttons.save')"
        :disabled="isSubmitting"
        :loading="isSubmitting"
        @click.stop="submitHandler"
      />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useForm } from 'vee-validate';

import { useFToast } from '@/composables/useFToast';
import { type MessageSchema } from '@/plugins/i18n';
import { useHRSettingsEmployeesStore } from '@/stores/hrSettings/Employees';
import EmployeeBasicInfoSection from '@/views/hrSettings/_components/employees/_modals/_components/EmployeeBasicInfoSection.vue';
import EmployeePasswordSection from '@/views/hrSettings/_components/employees/_modals/_components/EmployeePasswordSection.vue';
import EmployeeRoleSection from '@/views/hrSettings/_components/employees/_modals/_components/EmployeeRoleSection.vue';
import EmployeeTagsSalarySection from '@/views/hrSettings/_components/employees/_modals/_components/EmployeeTagsSalarySection.vue';
import { useEmployeeModalValidation } from '@/views/hrSettings/_composables/useEmployeeModalValidation';

import type { TheMemberViewModel } from '@/client';

interface IProps {
  data?: TheMemberViewModel;
}

interface IEmits {
  (event: 'fetchEmployees'): void;
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();
const { showSuccessMessage, showErrorMessage } = useFToast();
const employeesStore = useHRSettingsEmployeesStore();

const open = defineModel<boolean>('open');
const activeTab = ref(0);
const isClear = ref(false);
const isOnMounted = ref(false);

const isEditing = computed(() => !!props.data);

// Use validation composable
const { validationSchema } = useEmployeeModalValidation(activeTab, isEditing);

const { handleSubmit, isSubmitting, values, resetForm } = useForm({
  validationSchema,
});

// Options computed
const titleOptions = computed(() => {
  return employeesStore.employeeTitles.map((employee) => ({
    name: employee.Name,
    value: employee.ID,
  }));
});

const tagOptions = computed(() => employeesStore.tags);

const teamOptions = computed(() => {
  return employeesStore.teams.map((employee) => ({
    name: employee.Name,
    value: employee.ID,
  }));
});

const getInitialFormData = computed(() => {
  const employee = props.data;

  return {
    ...(employee && {
      memberName: employee.MemberName,
      email: employee.Email,
      enabled: employee.Enabled,
      title: {
        name: employee.TitleName,
        value: employee.TitleId,
      },
      team: {
        name: employee.TeamName,
        value: employee.TeamId,
      },
      operatingUser: employee.WindowsIdentity,
      salary: employee.Salary,
      password: employee.Password,
      repeatPassword: employee.Password,
    }),
  };
});

const handleClose = () => {
  open.value = false;
  resetForm();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const buildPayload = (formValues: any) => {
  if (isEditing.value) {
    const employee = props.data;
    return {
      id: employee?.ID,
      memberName: formValues.memberName,
      email: formValues.email,
      password: formValues.password,
      role: activeTab.value,
      salary: formValues.salary ?? employee?.Salary,
      teamId: formValues.team?.value ?? employee?.TeamId,
      teamName: formValues.team?.name ?? employee?.TeamName,
      titleId: formValues.title?.value ?? employee?.TeamId,
      titleName: formValues.title?.name ?? employee?.TitleName,
      windowsIdentity: formValues.WindowsIdentity ?? employee?.WindowsIdentity,
      enabled: isEditing.value ? formValues.enabled : employee?.Enabled,
      tags: formValues?.tags?.map((tag: { name: string }) => tag.name) ?? employee?.Tags ?? [],
    };
  }

  // New employee payloads by tab
  if (activeTab.value === 0) {
    return { emails: formValues.emails };
  }

  if (activeTab.value === 1) {
    return {
      memberName: formValues.memberName,
      email: formValues.email,
      password: formValues.password,
      role: activeTab.value,
      salary: formValues.salary,
      teamId: formValues.team?.value,
      teamName: formValues.team?.name,
      titleId: formValues.title?.value,
      titleName: formValues.title?.name,
      windowsIdentity: '',
      enabled: true,
      tags: [],
    };
  }

  // System Admin (tab 2)
  return {
    memberName: formValues.memberName,
    email: formValues.email,
    password: formValues.password,
    role: activeTab.value,
    salary: 0,
    teamId: '',
    teamName: '',
    titleId: '',
    titleName: '',
    windowsIdentity: '',
    enabled: true,
    tags: [],
  };
};

const submitHandler = handleSubmit(async (formValues) => {
  try {
    const text = isEditing.value
      ? t('pages.hrSettings.employees.modal.messages.updated')
      : t('pages.hrSettings.employees.modal.messages.added');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = buildPayload(formValues) as any;
    await employeesStore.save(payload);
    emit('fetchEmployees');
    showSuccessMessage(text);
    isClear.value = true;
    handleClose();
  } catch (error) {
    showErrorMessage(error as Error);
  }
});

onMounted(() => {
  if (isEditing.value) {
    const employee = props.data;

    if (employee && Object.keys(employee)?.length) {
      activeTab.value = employee?.Role ?? 0;
    }
    resetForm({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      values: getInitialFormData.value as any,
    });
  }
  isOnMounted.value = true;
});
</script>
