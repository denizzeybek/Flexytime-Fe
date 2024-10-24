export interface IWebAddress {
  DTO: IWebAddressDTO
  Status: number
  Description?: string
  Errors: any[]
}

export interface IWebAddressDTO {
  draw: number
  recordsTotal: number
  recordsFiltered: number
  currentPage: number
  data: IWebAddressDTOData[]
}

export interface IWebAddressDTOData {
  HostName: string
  DomainDisplay: string
  Name: string
  IsWork: boolean
  IsMeeting: boolean
  IsLeisure: boolean
  TopicName: string
  Actions?: null
  Customise?: null
  Timeout: {
    time: string
    statisticType: string
  }
  Teams: string
  ID: string
  AlwaysOn: boolean
  Domain: number
}

export interface IWebaddressDTOPayload {
  descending: boolean
  length: number
  search: string
  sort: string
  start: number
}
