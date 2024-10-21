export interface IApplication {
  DTO: IApplicationDTO
  Status: number
  Description?: string
  Errors: any[]
}

export interface IApplicationDTO {
  draw: number
  recordsTotal: number
  recordsFiltered: number
  currentPage: number
  data: IApplicationDTOData[]
}

export interface IApplicationDTOData {
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

export interface IApplicationDTOPayload {
  descending: boolean
  length: number
  search: string
  sort: string
  start: number
}
