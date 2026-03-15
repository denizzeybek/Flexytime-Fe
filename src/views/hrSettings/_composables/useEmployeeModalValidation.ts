import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { toTypedSchema } from '@vee-validate/yup';
import { array, boolean, number, object, string } from 'yup';

import type { TheMemberViewModel } from '@/client';
import type { MessageSchema } from '@/plugins/i18n';

export const useEmployeeModalValidation = (propsData: TheMemberViewModel | undefined) => {
  const { t } = useI18n<{ message: MessageSchema }>();
  const activeTab = ref(0);
  const isEditing = computed(() => !!propsData);

  // Helper to create required message
  const requiredMsg = (field: string) => t('common.validation.mixed.required', { field });
  const emailMsg = (field: string) => t('common.validation.string.email', { field });
  const minMsg = (field: string, min: number) => t('common.validation.string.min', { field, min });
  const arrayMinMsg = (field: string, min: number) => t('common.validation.array.min', { field, min });

  const emailsSchema = computed(() =>
    toTypedSchema(
      object({
        emails: array()
          .of(string().email(emailMsg(t('pages.hrSettings.employees.modal.email.label'))).required(requiredMsg(t('pages.hrSettings.employees.modal.email.label'))))
          .required(arrayMinMsg(t('pages.hrSettings.employees.modal.email.label'), 1))
          .min(1, arrayMinMsg(t('pages.hrSettings.employees.modal.email.label'), 1)),
      }),
    ),
  );

  const employeeEditSchema = computed(() =>
    toTypedSchema(
      object({
        memberName: string().required(requiredMsg(t('pages.hrSettings.employees.modal.memberName.label'))),
        email: string().required(requiredMsg(t('pages.hrSettings.employees.modal.email.label'))).email(emailMsg(t('pages.hrSettings.employees.modal.email.label'))),
        enabled: boolean().required(requiredMsg(t('pages.hrSettings.employees.modal.enabled.label'))),
        title: object()
          .shape({
            name: string(),
            value: string().required(requiredMsg(t('pages.hrSettings.employees.modal.title.label'))),
          })
          .required(requiredMsg(t('pages.hrSettings.employees.modal.title.label'))),
        team: object()
          .shape({
            name: string(),
            value: string().required(requiredMsg(t('pages.hrSettings.employees.modal.team.label'))),
          })
          .required(requiredMsg(t('pages.hrSettings.employees.modal.team.label'))),
        operatingUser: string().required(requiredMsg(t('pages.hrSettings.employees.modal.operatingUser.label'))),
        salary: number().required(requiredMsg(t('pages.hrSettings.employees.modal.salary.label'))),
        password: string().required(requiredMsg(t('pages.hrSettings.employees.modal.password.label'))).min(6, minMsg(t('pages.hrSettings.employees.modal.password.label'), 6)),
        tags: array()
          .nullable()
          .of(
            object().shape({
              name: string().nullable(),
              value: string().nullable(),
            }),
          ),
      }),
    ),
  );

  const teamManagerSchema = computed(() =>
    toTypedSchema(
      object({
        memberName: string().required(requiredMsg(t('pages.hrSettings.employees.modal.memberName.label'))),
        email: string().required(requiredMsg(t('pages.hrSettings.employees.modal.email.label'))).email(emailMsg(t('pages.hrSettings.employees.modal.email.label'))),
        title: object()
          .shape({
            name: string(),
            value: string().required(requiredMsg(t('pages.hrSettings.employees.modal.title.label'))),
          })
          .required(requiredMsg(t('pages.hrSettings.employees.modal.title.label'))),
        team: object()
          .shape({
            name: string(),
            value: string().required(requiredMsg(t('pages.hrSettings.employees.modal.team.label'))),
          })
          .required(requiredMsg(t('pages.hrSettings.employees.modal.team.label'))),
        enabled: boolean()
          .when([], {
            is: () => isEditing.value,
            then: (schema) => schema.required(requiredMsg(t('pages.hrSettings.employees.modal.enabled.label'))),
            otherwise: (schema) => schema.nullable(),
          }),
        salary: number().required(requiredMsg(t('pages.hrSettings.employees.modal.salary.label'))),
        password: string().required(requiredMsg(t('pages.hrSettings.employees.modal.password.label'))).min(6, minMsg(t('pages.hrSettings.employees.modal.password.label'), 6)),
      }),
    ),
  );

  const systemAdminSchema = computed(() =>
    toTypedSchema(
      object({
        memberName: string().required(requiredMsg(t('pages.hrSettings.employees.modal.memberName.label'))),
        email: string().required(requiredMsg(t('pages.hrSettings.employees.modal.email.label'))).email(emailMsg(t('pages.hrSettings.employees.modal.email.label'))),
        enabled: boolean()
          .when([], {
            is: () => isEditing.value,
            then: (schema) => schema.required(requiredMsg(t('pages.hrSettings.employees.modal.enabled.label'))),
            otherwise: (schema) => schema.nullable(),
          }),
        password: string().required(requiredMsg(t('pages.hrSettings.employees.modal.password.label'))).min(6, minMsg(t('pages.hrSettings.employees.modal.password.label'), 6)),
      }),
    ),
  );

  const validationSchema = computed(() => {
    if (activeTab.value === 0) {
      if (!isEditing.value) {
        return emailsSchema.value;
      }
      return employeeEditSchema.value;
    } else if (activeTab.value === 1) {
      return teamManagerSchema.value;
    }
    return systemAdminSchema.value;
  });

  return {
    validationSchema,
    activeTab,
    isEditing,
  };
};
