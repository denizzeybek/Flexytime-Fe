  // import { initializeIntercom } from '@/helpers/intercom'
  import { defineStore } from 'pinia'

  import { EStoreNames } from '@/stores/storeNames.enum'
  
  interface State {
    user?: any
    authentication?: any
    profile?: any
  }
  
  
  export const useUsersStore = defineStore(EStoreNames.COMMON_USERS, {
    state: (): State => ({
      user: undefined,
      authentication: undefined,
      profile: undefined,
    }),
    actions: {
      async setUser(payload: any) {
        this.authentication = payload?.authentication
        this.user = payload?.user
      },
    }
  })
  