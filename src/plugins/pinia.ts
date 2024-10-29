import { EStoreNames } from '@/stores/storeNames.enum'
import { createPinia, getActivePinia, type Pinia, type Store } from 'pinia'
import { type App } from 'vue'

interface ExtendedPinia extends Pinia {
  _s: Map<string, Store>
}

const resetList = [
  EStoreNames.AUTH,
  EStoreNames.CLASSIFICATION_WEB_ADDRESSES,
  EStoreNames.CLASSIFICATION_APPLICATIONS,
  EStoreNames.COMPANY_ORGANIZATION_CHARTS,
  EStoreNames.COMPANY_WORKING_HOURS,
  EStoreNames.HR_SETTINGS_EMPLOYEES,
  EStoreNames.HR_SETTINGS_ANNUALS,
  EStoreNames.HR_SETTINGS_HOLIDAYS,
  EStoreNames.SETTINGS_PERMISSIONS,
  EStoreNames.PROFILE,
  EStoreNames.COMMON_USERS,
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
