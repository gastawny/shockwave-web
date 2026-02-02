import { columnsGround } from './grounds-columns'
import { columnsFormThreats } from './formThreats-columns'
import { Tags } from '@/utils/constants/tags'
import { columnsObjectFormats } from './objectFormats-columns'
import { columnsUsers } from './users-columns'
import { columnsLocatedObjects } from './locatedObjects-columns'
import { columnsBombThreats } from './bombThreats-columns'
import { columnsExplosives } from './explosives-columns'
import { columnsPostExplosion } from './postExplosions-columns'

export const columnsDefinitions: Record<(typeof Tags)[number], any> = {
  grounds: columnsGround,
  formThreats: columnsFormThreats,
  explosives: columnsExplosives,
  objectFormats: columnsObjectFormats,
  locatedObjects: columnsLocatedObjects,
  bombThreats: columnsBombThreats,
  postExplosions: columnsPostExplosion,
  users: columnsUsers,
} as const
