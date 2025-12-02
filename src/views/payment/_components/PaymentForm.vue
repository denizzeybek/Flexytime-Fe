<template>
  <div class="rounded-3xl bg-white shadow-xl shadow-gray-200/50 overflow-hidden">
    <!-- Selected Plan Summary -->
    <PlanSummaryHeader
      :label="t('pages.payment.selectedPlan')"
      :plan-name="selectedPlan?.name || ''"
      :price="selectedPlan?.price || 0"
      :interval-label="intervalLabel"
    />

    <!-- Payment Content -->
    <div class="p-6">
      <!-- Order Details -->
      <div class="space-y-3 mb-6">
        <div class="flex justify-between items-center text-sm">
          <span class="text-gray-500">{{ t('pages.payment.billingCycle') }}</span>
          <span class="font-medium text-gray-900">
            {{ selectedPlan?.interval === 'month' ? t('pages.payment.monthly') : t('pages.payment.yearly') }}
          </span>
        </div>
        <div class="flex justify-between items-center text-sm">
          <span class="text-gray-500">{{ t('pages.payment.startDate') }}</span>
          <span class="font-medium text-gray-900">{{ t('pages.payment.today') }}</span>
        </div>
        <div class="h-px bg-gray-100 my-4"></div>
        <div class="flex justify-between items-center">
          <span class="font-semibold text-gray-900">{{ t('pages.payment.total') }}</span>
          <span class="text-xl font-bold text-gray-900">${{ selectedPlan?.price }}</span>
        </div>
      </div>

      <!-- Stripe Payment Form (Real Mode) -->
      <div v-if="isRealStripeMode && isStripeReady && clientSecret" class="space-y-4">
        <VueStripeElements
          ref="elementsRef"
          :stripe-key="stripeKey"
          :elements-options="elementsOptions"
        >
          <VueStripePaymentElement
            ref="paymentElementRef"
            :options="paymentElementOptions"
            @change="handlePaymentElementChange"
          />
        </VueStripeElements>

        <!-- Error Message -->
        <Message v-if="errorMessage" severity="error" :closable="false">
          {{ errorMessage }}
        </Message>

        <!-- Submit Button -->
        <Button
          :label="processing ? t('pages.payment.processing') : t('pages.payment.payNow')"
          :loading="processing"
          :disabled="!isComplete || processing"
          icon="pi pi-lock"
          class="w-full !py-4 !text-base !font-semibold !rounded-2xl"
          @click="handleSubmit"
        />
      </div>

      <!-- Mock Payment Form (Demo Mode) -->
      <div v-else class="space-y-4">
        <MockPaymentForm
          ref="mockFormRef"
          :card-number-label="t('pages.payment.cardNumber')"
          :expiry-label="t('pages.payment.expiry')"
          :cvc-label="t('pages.payment.cvc')"
          :demo-mode-text="t('pages.payment.demoMode')"
          @valid-change="handleMockValidChange"
        />

        <!-- Error Message -->
        <Message v-if="errorMessage" severity="error" :closable="false">
          {{ errorMessage }}
        </Message>

        <!-- Submit Button -->
        <Button
          :label="processing ? t('pages.payment.processing') : t('pages.payment.payNow')"
          :loading="processing"
          :disabled="!isMockFormValid || processing"
          icon="pi pi-lock"
          class="w-full !py-4 !text-base !font-semibold !rounded-2xl !bg-gradient-to-r !from-primary !to-blue-500 !border-0"
          @click="handleMockSubmit"
        />
      </div>

      <!-- Security Note -->
      <div class="flex items-center justify-center gap-2 text-gray-400 text-xs mt-4">
        <i class="pi pi-shield"></i>
        <span>{{ t('pages.payment.securePayment') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { VueStripeElements, VueStripePaymentElement } from '@vue-stripe/vue-stripe';

import Message from 'primevue/message';

import { PaymentService } from '@/customClient';
import { type MessageSchema } from '@/plugins/i18n';

import MockPaymentForm from './MockPaymentForm.vue';
import PlanSummaryHeader from './PlanSummaryHeader.vue';

import type { PricingPlan } from '@/customClient';
import type { Stripe, StripeElements as StripeElementsType, StripeElementsOptionsMode, StripePaymentElementOptions } from '@stripe/stripe-js';
import type { ComponentPublicInstance } from 'vue';

interface IProps {
  selectedPlan: PricingPlan | null;
}

interface IEmits {
  (e: 'success', paymentIntentId: string): void;
  (e: 'error', error: string): void;
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();

// Stripe configuration
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Refs
const elementsRef = ref<{ instance: Stripe; elements: StripeElementsType } | null>(null);
const paymentElementRef = ref<ComponentPublicInstance | null>(null);
const mockFormRef = ref<InstanceType<typeof MockPaymentForm> | null>(null);

// State
const clientSecret = ref<string>('');
const isStripeReady = ref(false);
const isComplete = ref(false);
const processing = ref(false);
const errorMessage = ref('');
const isMockFormValid = ref(false);

// Computed
const isRealStripeMode = computed(() => {
  return stripeKey && (stripeKey.startsWith('pk_test_') || stripeKey.startsWith('pk_live_'));
});

const intervalLabel = computed(() => {
  return props.selectedPlan?.interval === 'month' ? t('pages.payment.mo') : t('pages.payment.yr');
});

// Stripe Elements options
const elementsOptions = computed<StripeElementsOptionsMode>(() => ({
  mode: 'payment',
  amount: (props.selectedPlan?.price || 0) * 100,
  currency: props.selectedPlan?.currency?.toLowerCase() || 'usd',
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#3B82F6',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '12px',
    },
    rules: {
      '.Input': {
        border: '1px solid #e5e7eb',
        boxShadow: 'none',
        padding: '12px',
      },
      '.Input:focus': {
        border: '1px solid #3B82F6',
        boxShadow: '0 0 0 1px #3B82F6',
      },
    },
  },
}));

const paymentElementOptions = ref<StripePaymentElementOptions>({
  layout: 'tabs',
});

// Handle mock form valid change
const handleMockValidChange = (isValid: boolean) => {
  isMockFormValid.value = isValid;
};

// Handle payment element change
const handlePaymentElementChange = (event: { complete: boolean }) => {
  isComplete.value = event.complete;
  if (event.complete) {
    errorMessage.value = '';
  }
};

// Create payment intent
const createPaymentIntent = async () => {
  if (!props.selectedPlan) return;

  try {
    const response = await PaymentService.createPaymentIntent({
      planId: props.selectedPlan.id,
      currency: props.selectedPlan.currency,
    });
    clientSecret.value = response.clientSecret;
  } catch {
    errorMessage.value = t('pages.payment.errors.failedToInitialize');
    emit('error', 'Failed to initialize payment');
  }
};

// Handle real Stripe form submission
const handleSubmit = async () => {
  if (!elementsRef.value?.instance || !elementsRef.value?.elements) {
    errorMessage.value = t('pages.payment.errors.stripeNotLoaded');
    return;
  }

  processing.value = true;
  errorMessage.value = '';

  try {
    const stripe = elementsRef.value.instance;
    const elements = elementsRef.value.elements;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      errorMessage.value = error.message || t('pages.payment.errors.paymentFailed');
      emit('error', error.message || 'Payment failed');
    } else if (paymentIntent?.status === 'succeeded') {
      emit('success', paymentIntent.id);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : t('pages.payment.errors.unexpectedError');
    errorMessage.value = message;
    emit('error', message);
  } finally {
    processing.value = false;
  }
};

// Handle mock form submission
const handleMockSubmit = async () => {
  processing.value = true;
  errorMessage.value = '';

  try {
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate successful payment
    const mockPaymentIntentId = `pi_mock_${Date.now()}`;
    emit('success', mockPaymentIntentId);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : t('pages.payment.errors.unexpectedError');
    errorMessage.value = message;
    emit('error', message);
  } finally {
    processing.value = false;
  }
};

// Watch for plan changes
watch(
  () => props.selectedPlan,
  async (newPlan) => {
    if (newPlan) {
      await createPaymentIntent();
    }
  },
  { immediate: true }
);

// Initialize
onMounted(() => {
  setTimeout(() => {
    isStripeReady.value = true;
  }, 100);
});
</script>
