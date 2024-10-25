<template>
  <Dialog
    v-model:visible="open"
    modal
    header="Edit Profile"
    class="!bg-f-secondary-purple lg:!w-[700px] !w-full"
    :style="{ width: '50rem' }"
  >
    <Tabs v-model:value="activeTab">
      <div class="!flex !justify-center">
        <TabList>
          <Tab value="0">Employee</Tab>
          <Tab value="1">Team Manager</Tab>
          <Tab value="2">System Admin</Tab>
        </TabList>
      </div>
      <TabPanels>
        <TabPanel value="0">
          <form class="flex flex-col gap-5" @submit.prevent>
            <EmailInputList
              v-model:emails="emails"
              name="emails"
              :error-message="emailErrorMessage"
            />
          </form>
        </TabPanel>
        <TabPanel value="1">
          <form class="flex flex-col gap-5">
            <div class="flex flex-col gap-3">
              <FInput id="fullName" label="Full Name" name="fullName" />
              <FInput type="email" id="email" label="Email" name="email" />
              <FPassword id="password" label="Password" name="password" />
            </div>
          </form>
        </TabPanel>
        <TabPanel value="2">
          <p class="m-0">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium
            voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint
            occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt
            mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et
            expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque
            nihil impedit quo minus.
          </p>
        </TabPanel>
      </TabPanels>
    </Tabs>

    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click.stop="open = false"></Button>
      <Button
        type="submit"
        label="Save"
        :disabled="isSubmitting"
        @click.stop="submitHandler"
        :loading="isSubmitting"
      ></Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { defineModel, ref, computed } from 'vue';
import { useForm } from 'vee-validate';
import { boolean, string, object, array, number } from 'yup';
import { toTypedSchema } from '@vee-validate/yup';
import EmailInputList from '@/components/ui/local/EmailInputList.vue';
import { useFToast } from '@/composables/useFToast';

const { showSuccessMessage, showErrorMessage } = useFToast();

const open = defineModel<boolean>('open');
const activeTab = ref('0');
const emails = ref([]);
const emailErrorMessage = ref('');

const validationSchema: any = computed(() => {
  if (activeTab.value === '0') {
    return toTypedSchema(
      object({
        emails: array().of(string().email('email')).label('Emails').nullable(),
      }),
    );
  } else if (activeTab.value === '1') {
    return toTypedSchema(
      object({
        fullName: string().required().label('Full Name'),
        email: string().required().label('Email'),
        password: string().required().label('Title'),
      }),
    );
  } else if (activeTab.value === 'address') {
    return toTypedSchema(
      object({
        addressLine1: string().required().label('Address Line 1'),
        addressLine2: string().nullable().label('Address Line 2'),
        city: string().required().label('City'),
        country: string().required().label('Country'),
        zipCode: number().required().label('Zip Code'),
      }),
    );
  }
  return toTypedSchema(
    object({
      kycStatus: string().required().label('KYC Status'),
      kycId: string().nullable().label('KYC ID'),
    }),
  );
});

const { handleSubmit, isSubmitting, values, resetForm } = useForm({
  validationSchema,
});

const handleClose = () => {
  open.value = false;
  resetForm();
};

const submitHandler = handleSubmit(async (values) => {
  try {
    console.log('values ', values);
    if (activeTab.value === '0' && emails.value.length === 0) {
      emailErrorMessage.value = 'Emails are required';
      return;
    }
    console.log('emails ', emails.value);
    // emit('fetchEmployees');
    showSuccessMessage('Employee updated!');
    handleClose();
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});
</script>
