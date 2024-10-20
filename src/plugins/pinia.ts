import { EStoreNames } from '@/stores/storeNames.enum'
import { createPinia, getActivePinia, type Pinia, type Store } from 'pinia'
import { type App } from 'vue'

interface ExtendedPinia extends Pinia {
  _s: Map<string, Store>
}

const resetList = [
  EStoreNames.BUSINESSES_COMPANIES,
  EStoreNames.BUSINESSES_TALENTS,
  EStoreNames.BUSINESS_TRANSACTIONS,
  EStoreNames.BUSINESS_GUEST_CHECKOUT,
  EStoreNames.BUSINESS_PAYMENTS,

  EStoreNames.COMMON_PROJECTS,
  EStoreNames.COMMON_USERS,
  EStoreNames.COMMON_AUTH,
  EStoreNames.COMMON_CONTRACTS,
  EStoreNames.COMMON_TRANSACTIONS,
  EStoreNames.COMMON_PROMO_CODES,
  EStoreNames.COMMON_ETC,

  EStoreNames.TALENTS_BANK_ACCOUNTS,
  EStoreNames.TALENTS_CLIENTS,
  EStoreNames.TALENTS_COMPANIES,
  EStoreNames.TALENTS_TRANSACTIONS
]

export const resetStores = () => {
  const pinia = getActivePinia() as ExtendedPinia
  pinia._s.forEach((store) => {
    if (resetList.includes(store.$id as EStoreNames)) {
      store.$reset()
    }
  })
}

export default {
  install(app: App) {
    app.use(createPinia())
  }
}
