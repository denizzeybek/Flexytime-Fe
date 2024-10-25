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
          <form class="flex flex-col gap-4">
            <div class="flex items-center flex-col lg:flex-row gap-12">
              <div class="flex items-center justify-center flex-col gap-4 w-[282px]">
                <img
                  v-if="src"
                  :src="src"
                  alt="Image"
                  class="shadow-md rounded-xl w-full sm:w-64"
                  style="filter: grayscale(100%)"
                />
                <div
                  v-else
                  class="w-[100px] h-[100px] flex items-center justify-center border-2 rounded-full border-f-black"
                >
                  <span class="pi pi-user !text-6xl"></span>
                </div>
                <FileUpload
                  mode="basic"
                  @select="onFileSelect"
                  customUpload
                  auto
                  severity="secondary"
                  class="p-button-outlined"
                />
              </div>
              <div class="flex lg:flex-col flex-1 gap-4">
                <FInput class="grow" id="fullName" label="Full Name" name="fullName" />
                <FInput class="grow" type="email" id="email" label="Email" name="email" />
              </div>
            </div>
            <div class="flex gap-4 flex-1">
              <FInput class="grow" id="title" label="Title" name="title" />
              <FInput class="grow" id="team" label="Team" name="team" />
            </div>
            <div class="flex gap-4 flex-1">
              <FInput class="grow" id="salary" label="Salary" name="salary" />
            </div>
            <Divider />
            <div class="flex gap-4 flex-1">
              <FPassword class="grow" id="password" label="Password" name="password" />
              <FPassword
                class="grow"
                id="repeatPassword"
                label="Repeat Password"
                name="repeatPassword"
              />
            </div>
          </form>
        </TabPanel>
        <TabPanel value="2">
          <form class="flex flex-col gap-4">
            <div class="flex items-center flex-col lg:flex-row gap-12">
              <div class="flex items-center justify-center flex-col gap-4 w-[282px]">
                <img
                  v-if="src"
                  :src="src"
                  alt="Image"
                  class="shadow-md rounded-xl w-full sm:w-64"
                  style="filter: grayscale(100%)"
                />
                <div
                  v-else
                  class="w-[100px] h-[100px] flex items-center justify-center border-2 rounded-full border-f-black"
                >
                  <span class="pi pi-user !text-6xl"></span>
                </div>
                <FileUpload
                  mode="basic"
                  @select="onFileSelect"
                  customUpload
                  auto
                  severity="secondary"
                  class="p-button-outlined"
                />
              </div>
              <div class="flex lg:flex-col flex-1 gap-4">
                <FInput class="grow" id="fullName" label="Full Name" name="fullName" />
                <FInput class="grow" type="email" id="email" label="Email" name="email" />
              </div>
            </div>
            <Divider />
            <div class="flex gap-4 flex-1">
              <FPassword class="grow" id="password" label="Password" name="password" />
              <FPassword
                class="grow"
                id="repeatPassword"
                label="Repeat Password"
                name="repeatPassword"
              />
            </div>
          </form>
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
import { defineModel, computed, onMounted, ref } from 'vue';
import { useForm } from 'vee-validate';
import { boolean, string, object, array, number, ref as yupRef } from 'yup';
import { toTypedSchema } from '@vee-validate/yup';
import EmailInputList from '@/components/ui/local/EmailInputList.vue';
import { useFToast } from '@/composables/useFToast';

const { showSuccessMessage, showErrorMessage } = useFToast();

const open = defineModel<boolean>('open');
const activeTab = ref('0');
const emails = ref([]);
const emailErrorMessage = ref('');
const src = ref();

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
        email: string().required().email().label('Email'),
        title: string().required().label('Title'),
        team: string().required().label('Team'),
        salary: number().required().label('Salary'),
        password: string().required().min(6).label('Password'),
        repeatPassword: string()
          .oneOf([yupRef('password')], 'Passwords must match')
          .required()
          .min(6)
          .label('Repeat Password'),
      }),
    );
  } else if (activeTab.value === 'address') {
    return toTypedSchema(
      object({
        fullName: string().required().label('Full Name'),
        email: string().required().email().label('Email'),
        password: string().required().min(6).label('Password'),
        repeatPassword: string()
          .oneOf([yupRef('password')], 'Passwords must match')
          .required()
          .min(6)
          .label('Repeat Password'),
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

const onFileSelect = (event) => {
  const file = event.files[0];
  const reader = new FileReader();

  reader.onload = async (e) => {
    src.value = e?.target?.result;
  };

  reader.readAsDataURL(file);
};

const submitHandler = handleSubmit(async (values) => {
  try {
    console.log('values ', values);
    if (activeTab.value === '0' && emails.value.length === 0) {
      emailErrorMessage.value = 'Emails are required';
      return;
    }
    console.log('src ', src.value);
    // emit('fetchEmployees');
    showSuccessMessage('Employee updated!');
    // handleClose();
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

// const getInitialFormData = () => {
//   const talent = talentsStore.currentTalent;
//   const user = talent?.user;

//   return {
//     ...(talent && {
//       userStatus: user?.status,
//       firstName: user?.firstName,
//       lastName: user?.lastName,
//       email: user?.email,
//       identityNumber: user?.profile?.identityNumber,
//       dateOfBirth: user?.profile?.birthday,
//       kycStatus: talent?.kycStatus,
//       kycId: talent?.sumsubId,
//       phoneCode: user?.profile?.phoneCode,
//       phoneNo: user?.profile?.phone,
//       isEarlyPayEligible: talent?.isEarlyPayEligible || false,
//       isLowVolumeFeeEnabled: talent?.isLowVolumeFeeEnabled || false,
//     }),
//   };
// };

// onMounted(() => {

//   resetForm({
//     values: getInitialFormData(),
//   });
// });
</script>
