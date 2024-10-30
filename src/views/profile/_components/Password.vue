<template>
  <div>
    <form @submit="submitHandler" class="flex flex-col gap-12">
      <div class="flex flex-col lg:flex-row gap-4 lg:gap-12">
        <FPassword class="flex-1" id="password" label="Password" name="password" />
        <FPassword
          class="flex-1"
          id="repeatPassword"
          label="Repeat Password"
          name="repeatPassword"
        />
      </div>
      <div class="flex justify-center">
        <Button
          type="submit"
          label="Save"
          :disabled="isSubmitting"
          @click.stop="submitHandler"
          :loading="isSubmitting"
        ></Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import { string, object, ref as yupRef } from 'yup';
import { useFToast } from '@/composables/useFToast';

const { showSuccessMessage, showErrorMessage } = useFToast();

const validationSchema = object({
  password: string().required().min(6).label('Password'),
  repeatPassword: string()
    .oneOf([yupRef('password')], 'Repeat Passwords must match with password')
    .required()
    .min(6)
    .label('Repeat Password'),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema,
});

const submitHandler = handleSubmit(async (values) => {
  try {
    console.log('values ', values);

    showSuccessMessage('Holiday updated!');
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});
</script>
