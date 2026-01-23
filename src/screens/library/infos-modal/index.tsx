import { Tags } from '@/utils/constants/tags'
import { GroundsModal, GroundsModalProps } from './grounds-modal'
import { FormThreatsModal, FormThreatsModalProps } from './formThreats-modal'
import { ObjectFormatsModal, ObjectFormatsModalProps } from './objectFormats-modal'
import { UsersModal, UsersModalProps } from './users-modal'
import { LocatedObjectModalProps, LocatedObjectsModal } from './locatedObjects-modal'
import { BombThreatsModal, BombThreatsModalProps } from './bombThreats-modal'
import { ExplosivesModalProps, ExplosivesModal } from './explosives-modal'

export const infosModal: Record<(typeof Tags)[number], any> = {
  grounds: ({ method, data }: GroundsModalProps) => <GroundsModal method={method} data={data} />,
  formThreats: ({ method, data }: FormThreatsModalProps) => (
    <FormThreatsModal method={method} data={data} />
  ),
  explosives: ({ method, data }: ExplosivesModalProps) => (
    <ExplosivesModal method={method} data={data} />
  ),
  objectFormats: ({ method, data }: ObjectFormatsModalProps) => (
    <ObjectFormatsModal method={method} data={data} />
  ),
  locatedObjects: ({ method, data }: LocatedObjectModalProps) => (
    <LocatedObjectsModal method={method} data={data} />
  ),
  bombThreats: ({ method, data }: BombThreatsModalProps) => (
    <BombThreatsModal method={method} data={data} />
  ),
  users: ({ method, data }: UsersModalProps) => <UsersModal method={method} data={data} />,
} as const
