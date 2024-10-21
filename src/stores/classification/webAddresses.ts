import { EStoreNames } from '@/stores/storeNames.enum'
import { defineStore } from 'pinia'
import type { IWebAddress, IWebAddressDTOData, IWebaddressDTOPayload } from '@/interfaces/webAddress'
import axios from 'axios'
interface State {
  list: IWebAddressDTOData[]
  totalItems: number
}

export const useClassificationWebAddressesStore = defineStore(
  EStoreNames.CLASSIFICATION_WEB_ADDRESSES,
  {
    state: (): State => ({
      list: [],
      totalItems: 0
    }),
    actions: {
      filter(payload: IWebaddressDTOPayload) {
        return new Promise((resolve, reject) => {
          axios
            .post('/webapi/category/webaddresses/query', payload)
            .then((response) => {
              const { DTO } = response as unknown as IWebAddress
              this.list = DTO.data
              this.totalItems = DTO.recordsTotal
              resolve(response)
            })
            .catch((error) => {
              reject(error)
            })
        })
      }
    }
  }
)
