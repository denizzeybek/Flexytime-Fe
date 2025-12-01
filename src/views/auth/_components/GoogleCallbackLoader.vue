<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-white">
    <div class="flex flex-col items-center gap-6">
      <!-- Logo -->
      <img
        class="h-16 w-auto"
        src="@/components/images/login-logo.png"
        alt="Logo"
      />
      <!-- Spinner -->
      <div class="flex flex-col items-center gap-3">
        <i class="pi pi-spin pi-spinner text-4xl text-purple-600"></i>
        <p class="text-slate-600 font-medium">{{ $t('pages.auth.login.signingIn') }}</p>
      </div>
    </div>
  </div>
</template>
