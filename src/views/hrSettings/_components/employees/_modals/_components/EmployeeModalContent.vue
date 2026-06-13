<template>
  <form class="flex flex-col gap-5" autocomplete="off" @submit.prevent>
    <!-- Role Selection Dropdown -->
    <EmployeeRoleSelect v-model="selectedRole" />

    <Divider />

    <!-- Employee Role: Email List + optional Team/Title (only for new employee) -->
    <template v-if="isEmployeeRole && !isEditing">
      <FEmailList name="emails" type="text" :is-clear="isClear" />
      <EmployeeRoleSection :show-operating-user="false" />
    </template>

    <!-- Full Form (for edit mode or non-employee roles) -->
    <template v-else>
      <EmployeeBasicInfoSection :show-enabled="isEditing" />

      <!-- Role & Team Section (Employee & Team Manager only).
           Operating User (WindowsIdentity) is collected at agent-install
           time, not from this admin form — hide it on edit too. -->
      <template v-if="!isSystemAdminRole">
        <EmployeeRoleSection :show-operating-user="false" />
        <EmployeeTagsSalarySection
          :tag-options="tagOptions"
          :show-tags="isEmployeeRole"
        />
      </template>

      <Divider />
      <!-- Password is optional on edit (BE preserves the existing hash
           when the field is blank); we surface that in the placeholder
           so the operator doesn't think the field is mandatory. -->
      <EmployeePasswordSection :is-edit="isEditing" />
    </template>
  </form>

  <FModalFooter>
    <Button
      type="button"
      :label="t('common.buttons.cancel')"
      severity="secondary"
      outlined
      @click.stop="emit('close')"
    />
    <Button
      type="submit"
      :label="t('common.buttons.save')"
      :disabled="isSubmitting"
      :loading="isSubmitting"
      @click.stop="submitHandler"
    />
  </FModalFooter>
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

import type { TheMemberModifyDto, TheMemberViewModel } from '@/client';

interface IRoleOption {
  name: string;
  value: number;
  icon: string;
}

interface IProps {
  data?: TheMemberViewModel;
}

interface IEmits {
  (e: 'close'): void;
  (e: 'success'): void;
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();
const { showSuccessMessage, showErrorMessage } = useFToast();
const employeesStore = useHRSettingsEmployeesStore();
const { validationSchema, activeTab, isEditing } = useEmployeeModalValidation(props.data);
const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema,
});

const isClear = ref(false);
const selectedRole = ref<IRoleOption>({
  name: t('pages.hrSettings.employees.modal.tab.employee'),
  value: 0,
  icon: 'pi pi-user',
});

const isEmployeeRole = computed(() => selectedRole.value?.value === 0);
const isSystemAdminRole = computed(() => selectedRole.value?.value === 2);

const tagOptions = computed(() => employeesStore.tags ?? []);

const getInitialFormData = computed(() => {
  const employee = props.data;

  // Password is intentionally NOT pre-filled — the BE never echoes it
  // back (Rule 12: secrets stay write-only), and an empty input on the
  // edit form means "leave the existing hash untouched". See the
  // matching `passwordRule()` in useEmployeeModalValidation.
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
      // operatingUser dropped from v2 contract — the BE no longer
      // accepts it on save, and the read no longer emits it. Agent
      // installer owns Customer.WindowsIdentity.
      salary: employee.Salary,
    }),
  };
});

/**
 * Translate the vee-validate form values into the v2 BE save body
 * (PascalCase keys — `TheMemberModifyDto`). The legacy code paths sent
 * lowercase keys and the BE silently created malformed Customer +
 * PerformMember rows (`MemberName=undefined`, `Email=undefined`, …) —
 * fix is to mirror the contract field-for-field.
 *
 * The `salary` form field is a number but the BE stores it as a string
 * (legacy `Salary` was a decimal-as-string for currency precision); cast
 * here so the cell renders nicely and the BE's `$set` doesn't change shape
 * across saves.
 */
type EmployeeFormValues = {
  memberName?: string;
  email?: string;
  password?: string;
  enabled?: boolean;
  salary?: number;
  title?: { name?: string; value?: string };
  team?: { name?: string; value?: string };
  tags?: Array<{ name?: string; value?: string }>;
  emails?: string[];
};

const stringSalary = (value: number | undefined, fallback?: string): string | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return fallback;
};

const buildEditPayload = (
  formValues: EmployeeFormValues,
  roleValue: number,
): TheMemberModifyDto => {
  const employee = props.data;
  return {
    ID: employee?.ID,
    MemberName: formValues.memberName ?? employee?.MemberName ?? '',
    Email: formValues.email ?? employee?.Email ?? '',
    ...(formValues.password && { Password: formValues.password }),
    Role: roleValue,
    Salary: stringSalary(formValues.salary, employee?.Salary) ?? '',
    TeamId: formValues.team?.value ?? employee?.TeamId,
    TitleId: formValues.title?.value ?? employee?.TitleId,
    TitleName: formValues.title?.name ?? employee?.TitleName,
    Enabled: formValues.enabled ?? employee?.Enabled ?? true,
    Tags: formValues.tags?.map((tag) => tag.name ?? '').filter(Boolean) ?? employee?.Tags ?? [],
  };
};

const buildAddManagerPayload = (
  formValues: EmployeeFormValues,
  roleValue: number,
): TheMemberModifyDto => ({
  MemberName: formValues.memberName ?? '',
  Email: formValues.email ?? '',
  ...(formValues.password && { Password: formValues.password }),
  Role: roleValue,
  Salary: stringSalary(formValues.salary) ?? '',
  TeamId: formValues.team?.value,
  TitleId: formValues.title?.value,
  TitleName: formValues.title?.name,
  Enabled: true,
  Tags: [],
});

const buildAddAdminPayload = (
  formValues: EmployeeFormValues,
  roleValue: number,
): TheMemberModifyDto => ({
  MemberName: formValues.memberName ?? '',
  Email: formValues.email ?? '',
  ...(formValues.password && { Password: formValues.password }),
  Role: roleValue,
  Salary: '0',
  Enabled: true,
  Tags: [],
});

const submitHandler = handleSubmit(async (formValues) => {
  try {
    const text = isEditing.value
      ? t('pages.hrSettings.employees.modal.messages.updated')
      : t('pages.hrSettings.employees.modal.messages.added');

    const values = formValues as EmployeeFormValues;
    const roleValue = selectedRole.value?.value ?? 0;

    if (!isEditing.value && roleValue === 0) {
      // Add → Employee role uses the batch-invite endpoint, NOT
      // employee/save. saveEmployee can only create one record at a time
      // and expects the full PascalCase body; the FE only collects emails
      // here, so route through the invitation flow.
      // Title and Team are optional — pass undefined when not selected so
      // the store omits them from the payload.
      await employeesStore.inviteEmails(values.emails ?? [], {
        TeamId: values.team?.value,
        TitleId: values.title?.value,
      });
    } else {
      const payload = isEditing.value
        ? buildEditPayload(values, roleValue)
        : roleValue === 1
          ? buildAddManagerPayload(values, roleValue)
          : buildAddAdminPayload(values, roleValue);
      await employeesStore.save(payload);
    }

    showSuccessMessage(text);
    isClear.value = true;
    emit('success');
    emit('close');
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
});
</script>
