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
          <form v-if="!isEditing" class="flex flex-col gap-5" @submit.prevent>
            <EmailInputList
              v-model:emails="emails"
              name="emails"
              :error-message="emailErrorMessage"
            />
          </form>
          <form v-else class="flex flex-col gap-4">
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
                <FInput class="grow" id="fullName" label="Full Name" name="EfullName" />
                <FInput class="grow" type="email" id="email" label="Email" name="Eemail" />
                <FCheckbox v-if="isEditing" name="Eenabled" labelLeft label="Enabled" />
              </div>
            </div>
            <div class="flex gap-4 flex-1">
              <FInput class="grow" id="title" label="Title" name="Etitle" />
              <FInput
                class="grow"
                id="operatingUser"
                label="Operating User"
                name="EoperatingUser"
              />
            </div>
            <div class="flex items-center gap-4 flex-1">
              <FInput class="grow" id="salary" label="Salary" name="Esalary" />
            </div>
            <Divider />
            <div class="flex gap-4 flex-1">
              <FPassword class="grow" id="password" label="Password" name="Epassword" />
              <FPassword
                class="grow"
                id="repeatPassword"
                label="Repeat Password"
                name="ErepeatPassword"
              />
            </div>
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
                <FInput class="grow" id="fullName" label="Full Name" name="TMfullName" />
                <FInput class="grow" type="email" id="email" label="Email" name="TMemail" />
                <FCheckbox v-if="isEditing" name="TMenabled" labelLeft label="Enabled" />
              </div>
            </div>
            <div class="flex gap-4 flex-1">
              <FInput class="grow" id="title" label="Title" name="TMtitle" />
              <FInput class="grow" id="team" label="Team" name="TMteam" />
            </div>
            <div class="flex items-center gap-4 flex-1">
              <FInput class="grow" id="salary" label="Salary" name="TMsalary" />
            </div>
            <Divider />
            <div class="flex gap-4 flex-1">
              <FPassword class="grow" id="password" label="Password" name="TMpassword" />
              <FPassword
                class="grow"
                id="repeatPassword"
                label="Repeat Password"
                name="TMrepeatPassword"
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
                <FInput class="grow" id="fullName" label="Full Name" name="SYSfullName" />
                <FInput class="grow" type="email" id="email" label="Email" name="SYSemail" />
                <FCheckbox v-if="isEditing" name="SYSenabled" labelLeft label="Enabled" />
              </div>
            </div>
            <Divider />
            <div class="flex gap-4 flex-1">
              <FPassword class="grow" id="password" label="Password" name="SYSpassword" />
              <FPassword
                class="grow"
                id="repeatPassword"
                label="Repeat Password"
                name="SYSrepeatPassword"
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
import type { IEmployeeMember } from '@/interfaces/hrSettings/employee';

interface IProps {
  data?: IEmployeeMember;
}

const props = defineProps<IProps>();

interface IEmits {
  (event: 'fetchEmployees'): void;
}
const emit = defineEmits<IEmits>();

const { showSuccessMessage, showErrorMessage } = useFToast();

const open = defineModel<boolean>('open');
const activeTab = ref('0');
const emails = ref([]);
const emailErrorMessage = ref('');
const src = ref();

const isEditing = computed(() => !!props.data);
const validationSchema: any = computed(() => {
  if (activeTab.value === '0') {
    if (!isEditing.value) {
      return toTypedSchema(
        object({
          emails: array().of(string().email('email')).label('Emails').nullable(),
        }),
      );
    } else {
      return toTypedSchema(
        object({
          EfullName: string().required().label('Full Name'),
          Eemail: string().required().email().label('Email'),
          Eenabled: boolean().label('Enabled').required(),
          Etitle: string().required().label('Title'),
          EoperatingUser: string().required().label('Operating User'),
          Esalary: number().required().label('Salary'),
          Epassword: string().required().min(6).label('Password'),
          ErepeatPassword: string()
            .oneOf([yupRef('password')], 'Passwords must match')
            .required()
            .min(6)
            .label('Repeat Password'),
        }),
      );
    }
  } else if (activeTab.value === '1') {
    return toTypedSchema(
      object({
        TMfullName: string().required().label('Full Name'),
        TMemail: string().required().email().label('Email'),
        TMtitle: string().required().label('Title'),
        TMenabled: boolean()
          .label('Enabled')
          .when([], {
            is: () => isEditing.value,
            then: (schema) => schema.required(),
            otherwise: (schema) => schema.nullable(),
          }),
        TMteam: string().required().label('Team'),
        TMsalary: number().required().label('Salary'),
        TMpassword: string().required().min(6).label('Password'),
        TMrepeatPassword: string()
          .oneOf([yupRef('TMpassword')], 'Passwords must match')
          .required()
          .min(6)
          .label('Repeat Password'),
      }),
    );
  } else if (activeTab.value === '2') {
    return toTypedSchema(
      object({
        SYSfullName: string().required().label('Full Name'),
        SYSemail: string().required().email().label('Email'),
        SYSenabled: boolean()
          .label('Enabled')
          .when([], {
            is: () => isEditing.value,
            then: (schema) => schema.required(),
            otherwise: (schema) => schema.nullable(),
          }),
        SYSpassword: string().required().min(6).label('Password'),
        SYSrepeatPassword: string()
          .oneOf([yupRef('SYSpassword')], 'Passwords must match')
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
    emit('fetchEmployees');
    showSuccessMessage('Employee updated!');
    // handleClose();
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

const getInitialFormData = () => {
  const employee = props.data;

  return {
    ...(employee && {
      EfullName: employee.MemberName,
      Eemail: employee.Email,
      Eenabled: employee.Enabled,
      Etitle: employee.TitleName,
      EoperatingUser: employee.WindowsIdentity,
      Esalary: employee.Salary,
      Epassword: employee.Password,
      ErepeatPassword: employee.Password,

      TMfullName: employee.MemberName,
      TMemail: employee.Email,
      TMenabled: employee.Enabled,
      TMtitle: employee.TitleName,
      TMteam: employee.MemberName,
      TMsalary: employee.Salary,
      TMpassword: employee.Password,
      TMrepeatPassword: employee.Password,

      SYSfullName: employee.MemberName,
      SYSemail: employee.Email,
      SYSenabled: employee.Enabled,
      SYSpassword: employee.Password,
      SYSrepeatPassword: employee.Password,
    }),
  };
};

onMounted(() => {
  resetForm({
    values: getInitialFormData(),
  });
});
</script>
