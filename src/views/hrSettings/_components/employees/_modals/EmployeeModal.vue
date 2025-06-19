<template>
  <Dialog
    v-model:visible="open"
    modal
    header="Edit Employee"
    class="!bg-f-secondary-purple lg:!w-[700px] !w-full"
    :style="{ width: '50rem' }"
  >
    <template v-if="isOnMounted">
      <Tabs v-model:value="activeTab">
        <div class="!flex !justify-center">
          <TabList>
            <Tab :value="0">Employee</Tab>
            <Tab :value="1">Team Manager</Tab>
            <Tab :value="2">System Admin</Tab>
          </TabList>
        </div>
        <TabPanels>
          <TabPanel :value="0">
            <form v-if="!isEditing" class="flex flex-col gap-5" @submit.prevent>
              values.emails {{ values.emails }}
              <FEmailList name="emails" type="text" :is-clear="isClear" />
            </form>
            <form v-else class="flex flex-col gap-4">
              <div class="flex items-center flex-col lg:flex-row gap-12">
                <!-- <div class="flex items-center justify-center flex-col gap-4 w-[282px]">
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
              </div> -->
                <div class="flex lg:flex-col flex-1 gap-4">
                  <FInput class="grow" id="memberName" label="Full Name" name="memberName" />
                  <FInput class="grow" type="email" id="email" label="Email" name="email" />
                  <FCheckbox v-if="isEditing" name="enabled" labelLeft label="Enabled" />
                </div>
              </div>
              <div class="flex gap-4 flex-1">
                <FSelect
                  id="title"
                  class="grow"
                  name="title"
                  label="Title"
                  placeholder="Title"
                  :options="titleOptions"
                />
                <FSelect
                  id="team"
                  class="grow"
                  name="team"
                  label="Team"
                  placeholder="Team"
                  :options="teamOptions"
                />
                <FInput
                  class="grow"
                  id="operatingUser"
                  label="Operating User"
                  name="operatingUser"
                />
              </div>
              <div class="flex items-center gap-4 flex-1">
                <FMultiSelect
                  name="tags"
                  class="grow"
                  placeholder="Select tag(s)"
                  label="Tag"
                  :options="tagOptions"
                  :headerAddBtn="false"
                  :prime-props="{
                    maxSelectedLabels: 3,
                  }"
                />
                <FInput class="grow" id="salary" label="Salary" name="salary" />
              </div>
              <Divider />
              <div class="flex gap-4 flex-1">
                <FPassword class="grow" id="password" label="Password" name="password" />
                <!-- <FPassword
                class="grow"
                id="repeatPassword"
                label="Repeat Password"
                name="repeatPassword"
              /> -->
              </div>
            </form>
          </TabPanel>
          <TabPanel :value="1">
            <form class="flex flex-col gap-6">
              <div class="flex items-center flex-col lg:flex-row gap-12">
                <!-- <div class="flex items-center justify-center flex-col gap-4 w-[282px]">
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
              </div> -->
                <div class="flex lg:flex-col flex-1 gap-4">
                  <FInput class="grow" id="memberName" label="Full Name" name="memberName" />
                  <FInput class="grow" type="email" id="email" label="Email" name="email" />
                  <FCheckbox v-if="isEditing" name="enabled" labelLeft label="Enabled" />
                </div>
              </div>
              <div class="flex gap-4 flex-1">
                <FSelect
                  id="title"
                  class="grow"
                  name="title"
                  label="Title"
                  placeholder="Title"
                  :options="titleOptions"
                />
                <FSelect
                  id="team"
                  class="grow"
                  name="team"
                  label="Team"
                  placeholder="Team"
                  :options="teamOptions"
                />
              </div>
              <div class="flex items-center gap-4 flex-1">
                <FInput class="grow" id="salary" label="Salary" name="salary" />
              </div>
              <Divider />
              <div class="flex gap-4 flex-1">
                <FPassword class="grow" id="password" label="Password" name="password" />
                <!-- <FPassword
                class="grow"
                id="repeatPassword"
                label="Repeat Password"
                name="repeatPassword"
              /> -->
              </div>
            </form>
          </TabPanel>
          <TabPanel :value="2">
            <form class="flex flex-col gap-6">
              <div class="flex items-center flex-col lg:flex-row gap-12">
                <!-- <div class="flex items-center justify-center flex-col gap-4 w-[282px]">
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
              </div> -->
                <div class="flex lg:flex-col flex-1 gap-4">
                  <FInput class="grow" id="memberName" label="Full Name" name="memberName" />
                  <FInput class="grow" type="email" id="email" label="Email" name="email" />
                  <FCheckbox v-if="isEditing" name="enabled" labelLeft label="Enabled" />
                </div>
              </div>
              <Divider />
              <div class="flex gap-4 flex-1">
                <FPassword class="grow" id="password" label="Password" name="password" />
                <!-- <FPassword
                class="grow"
                id="repeatPassword"
                label="Repeat Password"
                name="repeatPassword"
              /> -->
              </div>
            </form>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </template>
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
import { computed, onMounted, ref } from 'vue';
import { useForm } from 'vee-validate';
import { boolean, string, object, array, number, ref as yupRef } from 'yup';
import { toTypedSchema } from '@vee-validate/yup';
import { useFToast } from '@/composables/useFToast';
import type { IEmployeeMember } from '@/interfaces/hrSettings/employee';
import { useHRSettingsEmployeesStore } from '@/stores/hrSettings/employees';

interface IProps {
  data?: IEmployeeMember;
}

const props = defineProps<IProps>();

interface IEmits {
  (event: 'fetchEmployees'): void;
}
const emit = defineEmits<IEmits>();

const { showSuccessMessage, showErrorMessage } = useFToast();
const employeesStore = useHRSettingsEmployeesStore();

const open = defineModel<boolean>('open');
const activeTab = ref(0);
const src = ref();
const isClear = ref(false);
const isOnMounted = ref(false);

const titleOptions = computed(() => {
  return employeesStore.employeeTitles.map((employee) => {
    return {
      name: employee.Name,
      value: employee.ID,
    };
  });
});

const tagOptions = computed(() => {
  return employeesStore.tags;
});

const teamOptions = computed(() => {
  return employeesStore.teams.map((employee) => {
    return {
      name: employee.Name,
      value: employee.ID,
    };
  });
});

const isEditing = computed(() => !!props.data);
const validationSchema: any = computed(() => {
  if (activeTab.value === 0) {
    if (!isEditing.value) {
      return toTypedSchema(
        object({
          emails: array()
            .label('Email')
            .of(
              string().email('Please enter a valid email address.').required('Email is required.'),
            )
            .required('Please add at least one email.')
            .min(1, 'Please add at least one email.'), // Ensures the array isn't empty
        }),
      );
    } else {
      return toTypedSchema(
        object({
          memberName: string().required().label('Full Name'),
          email: string().required().email().label('Email'),
          enabled: boolean().label('Enabled').required(),
          title: object()
            .shape({
              name: string().label('Title'),
              value: string().label('Title').required(),
            })
            .required()
            .label('Title'),
          team: object()
            .shape({
              name: string().label('Team'),
              value: string().label('Team').required(),
            })
            .required()
            .label('Team'),
          operatingUser: string().required().label('Operating User'),
          salary: number().required().label('Salary'),
          password: string().required().min(6).label('Password'),
          tags: array()
            .nullable()
            .label('Tags')
            .of(
              object().shape({
                name: string().nullable().label('Name'),
                value: string().nullable().label('Value'),
              }),
            ),
          // repeatPassword: string()
          //   .oneOf([yupRef('password')], 'Passwords must match')
          //   .required()
          //   .min(6)
          //   .label('Repeat Password'),
        }),
      );
    }
  } else if (activeTab.value === 1) {
    return toTypedSchema(
      object({
        memberName: string().required().label('Full Name'),
        email: string().required().email().label('Email'),
        title: object()
          .shape({
            name: string().label('Title'),
            value: string().label('Title').required(),
          })
          .required()
          .label('Title'),
        team: object()
          .shape({
            name: string().label('Team'),
            value: string().label('Team').required(),
          })
          .required()
          .label('Team'),
        enabled: boolean()
          .label('Enabled')
          .when([], {
            is: () => isEditing.value,
            then: (schema) => schema.required(),
            otherwise: (schema) => schema.nullable(),
          }),
        salary: number().required().label('Salary'),
        password: string().required().min(6).label('Password'),
        // repeatPassword: string()
        //   .oneOf([yupRef('password')], 'Passwords must match')
        //   .required()
        //   .min(6)
        //   .label('Repeat Password'),
      }),
    );
  }
  // else if (activeTab.value === '2') {
  return toTypedSchema(
    object({
      memberName: string().required().label('Full Name'),
      email: string().required().email().label('Email'),
      enabled: boolean()
        .label('Enabled')
        .when([], {
          is: () => isEditing.value,
          then: (schema) => schema.required(),
          otherwise: (schema) => schema.nullable(),
        }),
      password: string().required().min(6).label('Password'),
      // repeatPassword: string()
      //   .oneOf([yupRef('password')], 'Passwords must match')
      //   .required()
      //   .min(6)
      //   .label('Repeat Password'),
    }),
  );
  // }
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
    let text = 'Employee added!';
    let payload = {};
    if (isEditing.value) {
      const employee = props.data;
      text = 'Employee updated!';
      payload = {
        id: employee?.ID,
        memberName: values.memberName,
        email: values.email,
        password: values.password,
        role: activeTab.value,
        salary: values.salary ?? employee?.Salary,
        teamId: values.team.value ?? employee?.TeamId,
        teamName: values.team.name ?? employee?.TeamName,
        titleId: values.title.value ?? employee?.TeamId,
        titleName: values.title.name ?? employee?.TitleName,
        windowsIdentity: values.WindowsIdentity ?? employee?.WindowsIdentity,
        enabled: isEditing.value ? values.enabled : employee?.Enabled,
        tags: values?.tags?.map((tag) => tag.name) ?? employee?.Tags ?? [],
      };
    } else {
      if (activeTab.value === 0) {
        payload = {
          emails: values.emails,
        };
      } else if (activeTab.value === 1) {
        payload = {
          memberName: values.memberName,
          email: values.email,
          password: values.password,
          role: activeTab.value,
          salary: values.salary,
          teamId: values.team.value,
          teamName: values.team.name,
          titleId: values.title.value,
          titleName: values.title.name,
          windowsIdentity: '',
          enabled: true,
          tags: [],
        };
      } else {
        payload = {
          memberName: values.memberName,
          email: values.email,
          password: values.password,
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
      }
    }
    await employeesStore.save(payload);
    emit('fetchEmployees');
    showSuccessMessage(text);
    isClear.value = true;
    handleClose();
  } catch (error: any) {
    showErrorMessage(error as any);
  }
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

onMounted(() => {
  if (isEditing.value) {
    const employee = props.data;

    if (employee && Object.keys(employee)?.length) {
      activeTab.value = employee?.Role;
      console.log('employee?.Role ', employee?.Role);
    }
    resetForm({
      values: getInitialFormData.value,
    });
  }
  isOnMounted.value = true;
});
</script>
