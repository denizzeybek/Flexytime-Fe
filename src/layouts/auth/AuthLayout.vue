<template>
  <div class="relative flex min-h-screen h-screen">
    <AuthAside :ad="ads[adName]" />
    <main class="flex w-full overflow-auto flex-col items-center min-h-screen bg-f-tertiary-purple">
      <div class="px-4 flex justify-between items-center w-full lg:pt-3 mb-10">
        <FSelect
          name="language"
          :value="{ name: 'Turkish', value: 'tr' }"
          :options="languagesList"
          class="max-w-[140px] ms-auto"
        />
      </div>
      <slot></slot>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import AuthAside, { type IAd } from './_components/Authside.vue';

type TAdName = 'login' | 'register' | 'download' | 'forgot-password';

interface IProps {
  adName: TAdName;
}
withDefaults(defineProps<IProps>(), {
  adName: 'login',
});

const languagesList = [
  { name: 'Turkish', value: 'tr' },
  { name: 'English', value: 'en' },
];

const ads = computed(() => {
  return {
    login: {
      title: 'Get powerful productivity insights in minutes',
      features: [
        'Get a clear picture of how your teams work.',
        'Measure and improve productivity.',
        'Uncover inefficient processes and bottlenecks.',
        'Prevent quiet quitting, burnout, and high turnover.',
        'See who needs coaching or breaks.',
        'Spot and save money on unused software.',
        'Protect and grow your company’s profits.',
      ],
      // image: {
      //   name: 'business-invoice-ad.png',
      //   alt: 'Login',
      // },
    },
    register: {
      title: 'Create a free account now',
      features: [
        'Track and measure your team"s productivity.',
        'Measure and improve productivity.',
        'Uncover inefficient processes and bottlenecks.',
        'Prevent quiet quitting, burnout, and high turnover.',
        'See who needs coaching or breaks.',
        'Spot and save money on unused software.',
        'Protect and grow your company’s profits.',
      ],
    },
    download: {
      title: 'Install Flexytime on your computer',
      features: [
        'Track and measure your team"s productivity.',
        'Measure and improve productivity.',
        'Uncover inefficient processes and bottlenecks.',
        'Prevent quiet quitting, burnout, and high turnover.',
        'See who needs coaching or breaks.',
        'Spot and save money on unused software.',
        'Protect and grow your company’s profits.',
      ],
    },
    'forgot-password': {
      title: 'Reset Password',
      features: [
        'Track and measure your team"s productivity.',
        'Measure and improve productivity.',
        'Uncover inefficient processes and bottlenecks.',
        'Prevent quiet quitting, burnout, and high turnover.',
        'See who needs coaching or breaks.',
        'Spot and save money on unused software.',
        'Protect and grow your company’s profits.',
      ],
    },
  };
});
</script>
