import { AbilityBuilder, Ability } from '@casl/ability'
import permissions from './permissions.json'
import { UserDataType } from 'src/context/types'

export type Subjects = string
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete'

export type AppAbility = Ability<[Actions, Subjects]> | undefined

export const AppAbility = Ability as any
export type ACLObj = {
  action: Actions
  subject: string
}

// Define rules based on user's permissions
const defineRulesFor = (user: UserDataType) => {
  const { can, rules } = new AbilityBuilder(AppAbility)
  let permissionIDs: number[] = []

  if (Array.isArray(user.role) && user.role.length > 0) {
    // Handle case where user.role is an array
    permissionIDs = user.role[0].permissionID || []
    can(['read'], 'analytics')
  } else if (user.role === 'member') {
    can(['read'], 'member-page')
  } else {
    console.warn('User role not found or has an invalid format.')
  }

  // console.log('permissionIDs:', permissionIDs)

  permissionIDs.forEach(permissionID => {
    const permission = permissions.find(p => p.id === permissionID)
    if (permission) {
      can(permission.action, permission.subject)
    } else {
      // console.warn(`Permission with ID ${permissionID} not found.`)
    }
  })

  return rules
}

// Build Ability instance for a user
export const buildAbilityFor = (user: UserDataType): AppAbility => {
  return new AppAbility(defineRulesFor(user), {
    detectSubjectType: (object: unknown) => {
      if (typeof object === 'string') {
        return object
      } else if (typeof object === 'object' && object !== null && 'type' in object) {
        return object.type
      }

      return undefined // Or throw an error
    }
  })
}

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
