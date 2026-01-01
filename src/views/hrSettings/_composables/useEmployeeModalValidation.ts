import { computed, ref } from 'vue';

import { toTypedSchema } from '@vee-validate/yup';
import { array, boolean, number, object, string } from 'yup';

import type { TheMemberViewModel } from '@/client';

export const useEmployeeModalValidation = (propsData: TheMemberViewModel | undefined) => {
  const activeTab = ref(0);
  const isEditing = computed(() => !!propsData);
  const emailsSchema = toTypedSchema(
    object({
      emails: array()
        .label('Email')
        .of(string().email('Please enter a valid email address.').required('Email is required.'))
        .required('Please add at least one email.')
        .min(1, 'Please add at least one email.'),
    }),
  );

  const employeeEditSchema = toTypedSchema(
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
    }),
  );

  const teamManagerSchema = toTypedSchema(
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
    }),
  );

  const systemAdminSchema = toTypedSchema(
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
    }),
  );

  const validationSchema = computed(() => {
    if (activeTab.value === 0) {
      if (!isEditing.value) {
        return emailsSchema;
      }
      return employeeEditSchema;
    } else if (activeTab.value === 1) {
      return teamManagerSchema;
    }
    return systemAdminSchema;
  });

  return {
    validationSchema,
    activeTab,
    isEditing,
  };
};
