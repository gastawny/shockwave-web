export const Roles = ['ADMIN', 'MANAGER', 'COMMON_USER'] as const
export type Role = (typeof Roles)[number]
