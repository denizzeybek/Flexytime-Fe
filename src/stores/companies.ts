
import { EStoreNames } from '@/stores/storeNames.enum'
import { defineStore } from 'pinia'

interface State {
  // list: Company[]
  // currentCompany?: Company
}

export const useBusinessesCompaniesStore = defineStore(EStoreNames.BUSINESSES_COMPANIES, {
  state: (): State => ({
    list: [],
    currentCompany: undefined
  }),
  actions: {
    async filter(searchTerm?: string) {
      // const response =
      //   await BusinessesCompaniesService.businessCompanyControllerFilterCompanies(query)
      // this.list = response.data
      // return response
    },
  }
})
