
export interface MeModel {
  user_id: string
  email: string
  Permissions: Permission[]
}

export interface Permission {
  permission: string
  resource: string
  actions: string[]
}
