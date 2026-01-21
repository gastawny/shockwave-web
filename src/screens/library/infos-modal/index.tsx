import { Tags } from '@/utils/constants/tags'
import { GroundsModal, GroundsModalProps } from './grounds-modal'

export const infosModal: Record<(typeof Tags)[number], any> = {
  grounds: ({ method, ground }: GroundsModalProps) => (
    <GroundsModal method={method} ground={ground} />
  ),
  formThreats: () => <div></div>,
  explosives: () => <div></div>,
  objectFormats: () => <div></div>,
  locatedObjects: () => <div></div>,
} as const
