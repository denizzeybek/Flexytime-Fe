<template>
  <Dialog
    v-model:visible="open"
    modal
    :header="t('pages.hrSettings.employees.modal.header')"
    class="lg:!w-[700px] !w-full"
    :style="{ width: '50rem' }"
  >
    <template v-if="isOnMounted">
      <form class="flex flex-col gap-5" @submit.prevent>
        <!-- Role Selection Dropdown -->
        <EmployeeRoleSelect v-model="selectedRole" />

        <Divider />

        <!-- Employee Role: Email List (only for new employee) -->
        <template v-if="isEmployeeRole && !isEditing">
          <FEmailList name="emails" type="text" :is-clear="isClear" />
        </template>

        <!-- Full Form (for edit mode or non-employee roles) -->
        <template v-else>
          <EmployeeBasicInfoSection :show-enabled="isEditing" />

          <!-- Role & Team Section (Employee & Team Manager only) -->
          <template v-if="!isSystemAdminRole">
            <EmployeeRoleSection
              :title-options="titleOptions"
              :team-options="teamOptions"
              :show-operating-user="isEmployeeRole"
            />
            <EmployeeTagsSalarySection
              :tag-options="tagOptions"
              :show-tags="isEmployeeRole"
            />
          </template>

          <Divider />
          <EmployeePasswordSection />
        </template>
      </form>
    </template>

    <div class="flex justify-end gap-2 mt-4">
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
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useForm } from 'vee-validate';

import { useFToast } from '@/composables/useFToast';
import { type MessageSchema } from '@/plugins/i18n';
import { useHRSettingsEmployeesStore } from '@/stores/hrSettings/Employees';
import EmployeeBasicInfoSection from '@/views/hrSettings/_components/employees/_modals/_components/EmployeeBasicInfoSection.vue';
import EmployeePasswordSection from '@/views/hrSettings/_components/employees/_modals/_components/EmployeePasswordSection.vue';
import EmployeeRoleSection from '@/views/hrSettings/_components/employees/_modals/_components/EmployeeRoleSection.vue';
import EmployeeRoleSelect from '@/views/hrSettings/_components/employees/_modals/_components/EmployeeRoleSelect.vue';
import EmployeeTagsSalarySection from '@/views/hrSettings/_components/employees/_modals/_components/EmployeeTagsSalarySection.vue';
import { useEmployeeModalValidation } from '@/views/hrSettings/_composables/useEmployeeModalValidation';

import type { TheMemberViewModel } from '@/client';

interface IRoleOption {
  name: string;
  value: number;
  icon: string;
}

interface IProps {
  data?: TheMemberViewModel;
}

const props = defineProps<IProps>();

const { t } = useI18n<{ message: MessageSchema }>();
const { showSuccessMessage, showErrorMessage } = useFToast();
const employeesStore = useHRSettingsEmployeesStore();
const { validationSchema, activeTab, isEditing } = useEmployeeModalValidation(props.data);
const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema,
});

const open = defineModel<boolean>('open');
const isClear = ref(false);
const isOnMounted = ref(false);
const selectedRole = ref<IRoleOption>({
  name: t('pages.hrSettings.employees.modal.tab.employee'),
  value: 0,
  icon: 'pi pi-user',
});

const isEmployeeRole = computed(() => selectedRole.value?.value === 0);
const isSystemAdminRole = computed(() => selectedRole.value?.value === 2);

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

const buildPayload = (formValues: any) => {
  const roleValue = selectedRole.value?.value ?? 0;

  if (isEditing.value) {
    const employee = props.data;
    return {
      id: employee?.ID,
      memberName: formValues.memberName,
      email: formValues.email,
      password: formValues.password,
      role: roleValue,
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

  // New employee payloads by role
  if (roleValue === 0) {
    return { emails: formValues.emails };
  }

  if (roleValue === 1) {
    return {
      memberName: formValues.memberName,
      email: formValues.email,
      password: formValues.password,
      role: roleValue,
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

  // System Admin (role 2)
  return {
    memberName: formValues.memberName,
    email: formValues.email,
    password: formValues.password,
    role: roleValue,
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

    const payload = buildPayload(formValues) as any;
    await employeesStore.save(payload);
    showSuccessMessage(text);
    isClear.value = true;
    handleClose();
  } catch (error) {
    showErrorMessage(error as Error);
  }
});

// Sync selectedRole with activeTab for validation
watch(
  selectedRole,
  (newRole) => {
    if (newRole) {
      activeTab.value = newRole.value;
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (isEditing.value) {
    const employee = props.data;

    if (employee && Object.keys(employee)?.length) {
      const role = employee?.Role ?? 0;
      const roleMap: Record<number, IRoleOption> = {
        0: { name: t('pages.hrSettings.employees.modal.tab.employee'), value: 0, icon: 'pi pi-user' },
        1: { name: t('pages.hrSettings.employees.modal.tab.teamManager'), value: 1, icon: 'pi pi-users' },
        2: { name: t('pages.hrSettings.employees.modal.tab.systemAdmin'), value: 2, icon: 'pi pi-shield' },
      };
      selectedRole.value = roleMap[role] ?? roleMap[0];
    }
    resetForm({
      values: getInitialFormData.value as any,
    });
  }
  isOnMounted.value = true;
});
</script>
