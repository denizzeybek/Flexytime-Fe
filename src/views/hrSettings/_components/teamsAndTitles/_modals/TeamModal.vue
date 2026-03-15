<template>
  <Dialog
    v-model:visible="open"
    modal
    :header="isEditing ? t('pages.hrSettings.teamsAndTitles.teams.modal.edit') : t('pages.hrSettings.teamsAndTitles.teams.modal.add')"
    class="lg:!w-[500px] !w-full"
    :style="{ width: '30rem' }"
  >
    <form v-if="open" class="flex flex-col gap-4" @submit="onSubmit">
      <div class="flex flex-col gap-2">
        <label for="teamName">{{ t('pages.hrSettings.teamsAndTitles.teams.form.name') }}</label>
        <InputText
          id="teamName"
          v-model="name"
          v-bind="nameAttrs"
          :placeholder="t('pages.hrSettings.teamsAndTitles.teams.form.namePlaceholder')"
          :invalid="!!errors.name"
        />
        <small v-if="errors.name" class="text-red-500">{{ errors.name }}</small>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <Button
          type="button"
          :label="t('common.buttons.cancel')"
          severity="secondary"
          @click="open = false"
        />
        <Button
          type="submit"
          :label="t('common.buttons.save')"
          :loading="isSubmitting"
        />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { toTypedSchema } from '@vee-validate/yup';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

import { useOperationFeedback } from '@/composables/useOperationFeedback';
import { type MessageSchema } from '@/plugins/i18n';
import { useHRSettingsTeamsStore } from '@/stores/hrSettings/teams';

import type { TeamListItem } from '@/stores/hrSettings/teams';

interface IProps {
  data?: TeamListItem;
}

const props = defineProps<IProps>();

const { t } = useI18n<{ message: MessageSchema }>();
const { executeWithFeedback } = useOperationFeedback();
const teamsStore = useHRSettingsTeamsStore();

const open = defineModel<boolean>('open');

const isEditing = computed(() => !!props.data);

const schema = toTypedSchema(
  yup.object({
    name: yup.string().required(t('validation.required')),
  }),
);

const { defineField, handleSubmit, errors, isSubmitting } = useForm({
  validationSchema: schema,
  initialValues: {
    name: props.data?.Name || '',
  },
});

const [name, nameAttrs] = defineField('name');

const onSubmit = handleSubmit(async (values) => {
  const payload = {
    ID: props.data?.ID,
    Name: values.name,
  };

  await executeWithFeedback(
    () => teamsStore.saveTeam(payload),
    isEditing.value
      ? t('pages.hrSettings.teamsAndTitles.teams.messages.updated')
      : t('pages.hrSettings.teamsAndTitles.teams.messages.created'),
  );

  open.value = false;
});
</script>
