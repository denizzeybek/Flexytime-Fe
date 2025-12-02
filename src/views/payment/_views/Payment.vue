<template>
  <Card class="shadow-sm rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-white relative">
    <template #content>
      <!-- Decorative Background Pattern -->
      <div class="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div class="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <!-- Success State -->
      <PaymentSuccessState
        v-if="paymentSuccess"
        :title="t('pages.payment.success.title')"
        :description="t('pages.payment.success.description')"
        :button-label="t('pages.payment.success.goToDashboard')"
        @action="goToDashboard"
      />

      <!-- Main Content -->
      <div v-else class="relative">
        <!-- Header Section -->
        <div class="text-center pt-8 pb-8">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4">
            {{ t('pages.payment.title') }}
          </h1>
          <p class="text-gray-500 text-lg max-w-xl mx-auto">
            {{ t('pages.payment.subtitle') }}
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-20">
          <div class="relative">
            <div class="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
            <ProgressSpinner style="width: 50px; height: 50px" class="relative" />
          </div>
          <p class="text-gray-400 mt-6">{{ t('pages.payment.loadingPlans') }}</p>
        </div>

        <!-- Main Grid Layout -->
        <div v-else class="px-4 pb-8">
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            <!-- Left Side - Plan Cards (3 columns) -->
            <div class="lg:col-span-3">
              <!-- Plan Cards -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <PlanCard
                  v-for="plan in plans"
                  :key="plan.id"
                  :plan="plan"
                  :selected="selectedPlan?.id === plan.id"
                  @select="handlePlanSelect"
                />
              </div>

              <!-- Trust Indicators -->
              <div class="flex flex-wrap items-center justify-center gap-6 py-6">
                <TrustBadge
                  v-for="badge in trustBadges"
                  :key="badge.label"
                  :icon="badge.icon"
                  :label="badge.label"
                  :color="badge.color"
                />
              </div>

              <!-- Features Section -->
              <div class="mt-12 pt-12 border-t border-gray-100/60 px-4">
                <div class="text-center mb-12">
                  <h2 class="text-2xl font-bold text-gray-900 mb-3">
                    {{ t('pages.payment.whyChooseUs') }}
                  </h2>
                  <p class="text-gray-500">
                    {{ t('pages.payment.whyChooseUsSubtitle') }}
                  </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                  <FeatureCard
                    v-for="feature in features"
                    :key="feature.title"
                    :icon="feature.icon"
                    :title="feature.title"
                    :description="feature.description"
                    :color="feature.color"
                  />
                </div>
              </div>
            </div>

            <!-- Right Side - Payment Form (1 column) -->
            <div class="lg:col-span-1">
              <div class="sticky top-6">
                <PaymentForm
                  v-if="selectedPlan"
                  :selected-plan="selectedPlan"
                  @success="handlePaymentSuccess"
                  @error="handlePaymentError"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import Card from 'primevue/card';
import ProgressSpinner from 'primevue/progressspinner';

import { useFToast } from '@/composables/useFToast';
import { PaymentService } from '@/customClient';
import { type MessageSchema } from '@/plugins/i18n';
import { ERouteNames } from '@/router/routeNames.enum';

import FeatureCard from '../_components/FeatureCard.vue';
import PaymentForm from '../_components/PaymentForm.vue';
import PaymentSuccessState from '../_components/PaymentSuccessState.vue';
import PlanCard from '../_components/PlanCard.vue';
import TrustBadge from '../_components/TrustBadge.vue';

import type { PricingPlan } from '@/customClient';

const { t } = useI18n<{ message: MessageSchema }>();
const router = useRouter();
const { showSuccessMessage, showErrorMessage } = useFToast();

// State
const loading = ref(true);
const plans = ref<PricingPlan[]>([]);
const selectedPlan = ref<PricingPlan | null>(null);
const paymentSuccess = ref(false);

// Trust badges configuration
const trustBadges = computed(() => [
  {
    icon: 'pi pi-shield',
    label: t('pages.payment.trustBadges.secure'),
    color: 'green' as const,
  },
  {
    icon: 'pi pi-credit-card',
    label: t('pages.payment.trustBadges.cards'),
    color: 'blue' as const,
  },
  {
    icon: 'pi pi-refresh',
    label: t('pages.payment.trustBadges.cancel'),
    color: 'purple' as const,
  },
]);

// Features configuration
const features = computed(() => [
  {
    icon: 'pi pi-clock',
    title: t('pages.payment.features.timeTracking.title'),
    description: t('pages.payment.features.timeTracking.description'),
    color: 'blue' as const,
  },
  {
    icon: 'pi pi-chart-bar',
    title: t('pages.payment.features.analytics.title'),
    description: t('pages.payment.features.analytics.description'),
    color: 'green' as const,
  },
  {
    icon: 'pi pi-users',
    title: t('pages.payment.features.teamManagement.title'),
    description: t('pages.payment.features.teamManagement.description'),
    color: 'purple' as const,
  },
]);

// Fetch plans
const fetchPlans = async () => {
  try {
    loading.value = true;
    plans.value = await PaymentService.getPlans();

    // Auto-select recommended plan
    const recommended = plans.value.find((p) => p.recommended);
    if (recommended) {
      selectedPlan.value = recommended;
    }
  } catch {
    showErrorMessage(t('pages.payment.errors.failedToLoadPlans'));
  } finally {
    loading.value = false;
  }
};

// Handle plan selection
const handlePlanSelect = (plan: PricingPlan) => {
  selectedPlan.value = plan;
};

// Handle successful payment
const handlePaymentSuccess = (paymentIntentId: string) => {
  console.log('Payment successful:', paymentIntentId);
  paymentSuccess.value = true;
  showSuccessMessage(t('pages.payment.success.message'));
};

// Handle payment error
const handlePaymentError = (error: string) => {
  showErrorMessage(error);
};

// Go to dashboard
const goToDashboard = () => {
  router.push({ name: ERouteNames.WorktimeUsage });
};

// Initialize
onMounted(() => {
  fetchPlans();
});
</script>

<style scoped>
@reference "@/tailwind.css";
</style>
