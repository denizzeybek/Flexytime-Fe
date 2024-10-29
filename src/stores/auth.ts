import { defineStore } from 'pinia'
import { EStorageKeys } from '@/constants/storageKeys'
import { computed } from 'vue'
import { EStoreNames } from '@/stores/storeNames.enum'
import { useUsersStore } from './users'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import qs from 'qs'
import { authLoginHeader, authHeader } from '../helpers/auth'

export const useAuthStore = defineStore(EStoreNames.AUTH, () => {
  const usersStore = useUsersStore()

  const router = useRouter()
  const route = useRoute()

  const isAuth = computed(() => !!usersStore.user)

  return {
    isAuth,
    setAuth(payload: any) {
      const { authentication, user } = payload
      usersStore.setUser(payload)
      if (authentication) {
        localStorage.setItem(EStorageKeys.USER, JSON.stringify(payload.user))
      }
      if (user) {
        localStorage.setItem(EStorageKeys.AUTHENTICATION, JSON.stringify(payload.authentication))
      }
    },
    $reset() {
      //   OpenAPI.TOKEN = undefined
      localStorage.removeItem(EStorageKeys.AUTHENTICATION)
    },
    async login(payload: any) {
      return new Promise((resolve, reject) => {
        axios
          .post('/oauth/token', qs.stringify(payload), { headers: authLoginHeader() })
          .then((response) => {
            console.log('login response ', response)
            this.setAuth({ authentication: response, user: null })
            this.getProfile(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    async getProfile(result) {
      const languageCode = localStorage.getItem('languageCode')
      if (!languageCode) localStorage.setItem('languageCode', 'en')
      const request = { languageCode: languageCode }
      const header = authHeader()
      return new Promise((resolve, reject) => {
        axios
          .post('/webapi/wizard/profile`', request, { headers: header })
          .then((response) => {
            this.setAuth({ authentication: null, user: response })
            result.user = response.data
            return resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  }
})
