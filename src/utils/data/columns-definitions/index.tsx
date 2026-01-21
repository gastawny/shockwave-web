import { columnsGround } from './ground-columns'
import { columnsFormThreats } from './formThreats-columns'
import { Tags } from '@/utils/constants/tags'

export const columnsDefinitions: Record<(typeof Tags)[number], any> = {
  grounds: columnsGround,
  formThreats: columnsFormThreats,
  explosives: [],
  objectFormats: [],
  locatedObjects: [],
} as const
