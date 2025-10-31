<template>
  <Dialog
    v-model:visible="open"
    modal
    :header="isEditing ? 'Update Company' : 'Add Company'"
    class="!bg-f-secondary-purple lg:!w-[700px] !w-full"
    :style="{ width: '50rem' }"
  >
    <form class="flex flex-col gap-6" @submit="submitHandler">
      <div class="flex gap-4 flex-1">
        <FInput class="flex-1" label="Company Name" name="name" placeholder="Enter company name" />
        <FInput
          class="flex-1"
          label="Authorized Name"
          name="fullname"
          placeholder="Enter authorized name"
        />
      </div>

      <div class="flex gap-4 flex-1">
        <FInput
          class="flex-1"
          label="Authorized Email"
          name="email"
          placeholder="Enter authorized email"
        />
        <FPassword class="flex-1" id="password" label="Password" name="password" />
      </div>

      <div class="flex gap-4 flex-1">
        <FInput class="flex-1" label="User Count" name="userCount" placeholder="Enter user count" />
        <FInput
          class="flex-1"
          label="User Period"
          name="userPeriod"
          placeholder="Enter user period"
        />
      </div>

      <div class="flex w-50 justify-center">
        <Button :disabled="isSubmitting" :loading="isSubmitting" type="submit" label="Save" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useForm } from 'vee-validate';
import { string, object, number } from 'yup';
import { useFToast } from '@/composables/useFToast';
import type { ICompany } from '@/interfaces/settings/company';

interface IProps {
  data?: ICompany;
}

const props = defineProps<IProps>();

interface IEmits {
  (event: 'fetchCompanies'): void;
}
const emit = defineEmits<IEmits>();

const { showSuccessMessage, showErrorMessage } = useFToast();

const open = defineModel<boolean>('open');

const isEditing = computed(() => !!props.data);

const validationSchema = object({
  name: string().required().label('Company name'),
  fullname: string().required().label('Authorized Name'),
  email: string().required().label('Authorized Email'),
  password: string().required().min(6).label('Password'),
  userCount: number().required().label('User Count'),
  userPeriod: number().required().label('User Period'),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema,
});

const handleClose = () => {
  resetForm();
  open.value = false;
};

const submitHandler = handleSubmit(async (values) => {
  try {
    console.log('values ', values);

    emit('fetchCompanies');
    showSuccessMessage('Company updated!');
    handleClose();
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

const getInitialFormData = () => {
  const company = props.data;

  if (!company) return {};

  return {
    name: company.Name,
    fullname: company.Fullname,
    email: company.Email,
    password: company.Password || '',
    userCount: company.UserCount,
    userPeriod: company.Month,
  };
};

// Reset form whenever modal opens or data changes
watch(
  [open, () => props.data],
  ([isOpen]) => {
    if (isOpen) {
      if (isEditing.value) {
        // Edit mode: populate form with existing data
        resetForm({
          values: getInitialFormData(),
        });
      } else {
        // Add mode: clear form completely
        resetForm();
      }
    }
  },
);
</script>
