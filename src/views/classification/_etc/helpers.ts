import { EDomain } from '@/enums/domain.enum'

export const getDomainEnum = (domain: number) => {
  switch (domain) {
    case 1:
      return EDomain.UNCLASSIFIED
    case 2:
      return EDomain.LEISURE
    case 3:
      return EDomain.MEETING
    case 4:
      return EDomain.WORK

    default:
      return null
  }
}
