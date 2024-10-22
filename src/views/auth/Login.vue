<template>
  <div class="bg-surface-50 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
    <div
      class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded-border w-full lg:w-6/12 mx-auto"
    >
      <div class="text-center mb-8">
        <svg
          class="mb-4 mx-auto fill-surface-600 dark:fill-surface-200 h-16"
          viewBox="0 0 30 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M20.7207 6.18211L14.9944 3.11148L3.46855 9.28678L0.579749 7.73444L14.9944 0L23.6242 4.62977L20.7207 6.18211ZM14.9996 12.3574L26.5182 6.1821L29.4216 7.73443L14.9996 15.4621L6.37724 10.8391L9.27337 9.28677L14.9996 12.3574ZM2.89613 16.572L0 15.0196V24.2656L14.4147 32V28.8953L2.89613 22.7132V16.572ZM11.5185 18.09L0 11.9147V8.81001L14.4147 16.5376V25.7904L11.5185 24.2312V18.09ZM24.2086 15.0194V11.9147L15.5788 16.5377V31.9998L18.475 30.4474V18.09L24.2086 15.0194ZM27.0969 22.7129V10.3623L30.0004 8.81V24.2653L21.3706 28.895V25.7904L27.0969 22.7129Z"
          />
        </svg>

        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">
          Welcome Back
        </div>
        <span class="text-surface-600 dark:text-surface-200 font-medium leading-normal"
          >Don't have an account?</span
        >
        <a class="font-medium no-underline ml-2 text-primary cursor-pointer">Create today!</a>
      </div>
      <form class="flex flex-col gap-5" @submit="submitHandler">
        <div class="flex flex-col gap-3">
          <FInput type="email" id="email" label="Email" name="email" />
          <FPassword id="password" label="Password" name="password" />
          <FSelect label="Country" name="country" placeholder="Select country" :options="countries">
            <template #customFooter>
              <div class="p-3">
                <Button
                  label="Add New"
                  fluid
                  severity="secondary"
                  text
                  size="small"
                  icon="pi pi-plus"
                />
              </div>
            </template>
            <template #customDropdownIcon>
              <i class="pi pi-map" />
            </template>
          </FSelect>

          <FMultiSelect
            label="Countries"
            name="countryList"
            placeholder="Select countries"
            v-model="countryList"
            :options="options"
          >
            <template #customHeader>Header Section</template>
            <template #customFooter>
              <div class="p-3 flex justify-between">
                <Button label="Add New" severity="secondary" text size="small" icon="pi pi-plus" />
                <Button label="Remove All" severity="danger" text size="small" icon="pi pi-times" />
              </div>
            </template>
          </FMultiSelect>
          <FCheckbox name="check" label="Remember me" />
          <Button
            :disabled="isSubmitting"
            :loading="isSubmitting"
            type="submit"
            label="Sign In"
            icon="pi pi-user"
            class="w-full"
          />
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import Button from 'primevue/button';
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { boolean, string, object, array } from 'yup';
import Checkbox from 'primevue/checkbox';

const authStore = useAuthStore();

const validationSchema = object({
  email: string().required().email().label('Email address'),
  password: string().required().min(6).label('Password'),
  check: boolean().required().isTrue('You must agree to terms and conditions').label('Check'),
  country: object()
    .shape({
      name: string(),
      value: string().required('Country selection is required').label('Country Value'),
      icon: string(),
    })
    .required()
    .label('Country'),
  countryList: array()
    .required()
    .label('Country List')
    .of(
      object().shape({
        name: string().required().label('Name'),
        code: string().required().label('Code'),
      }),
    ),
});

const { handleSubmit, isSubmitting, defineField, resetForm, errors } = useForm({
  validationSchema,
});

const [email] = defineField('email');
const [password] = defineField('password');
const [check] = defineField('check');
const [country] = defineField('country');
const [countryList] = defineField('countryList');

const submitHandler = handleSubmit(async (values) => {
  try {
    console.log('values ', values);
    // await authStore.login(values);
  } catch (error) {
    console.log(error);
    // showErrorMessage(t('common.error.invalid_credentials'));
  }
});

const countries = ref([
  { name: 'Australia', value: 'AU', icon: 'pi pi-check' },
  { name: 'Brazil', value: 'BR', icon: 'pi pi-times' },
  { name: 'China', value: 'CN', icon: 'pi pi-search' },
  { name: 'Egypt', value: 'EG', icon: 'pi pi-user' },
  { name: 'France', value: 'FR', icon: 'pi pi-bars' },
  { name: 'Germany', value: 'DE', icon: 'pi pi-bell' },
  { name: 'India', value: 'IN', icon: 'pi pi-box' },
  { name: 'Japan', value: 'JP', icon: 'pi pi-calendar' },
  { name: 'Spain', value: 'ES', icon: 'pi pi-cart-minus' },
]);

const options = ref([
  { name: 'Australia', code: 'AU' },
  { name: 'Brazil', code: 'BR' },
  { name: 'China', code: 'CN' },
  { name: 'Egypt', code: 'EG' },
  { name: 'France', code: 'FR' },
  { name: 'Germany', code: 'DE' },
  { name: 'India', code: 'IN' },
  { name: 'Japan', code: 'JP' },
  { name: 'Spain', code: 'ES' },
  { name: 'United States', code: 'US' },
]);
</script>
