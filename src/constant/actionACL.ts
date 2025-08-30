export const APP_ACTIONS = {
  // common actions
  READ_ALL: "read_all",
  READ_ONE: "read_one",
  UPDATE: "update",
  CREATE: "create",
  DELETE: "delete",
  ENABLE_AND_DISABLE: "enable_and_disable",

  // action and resource constants
  READ_RESOURCES: "read_resources",
  READ_ACTIONS: "read_actions",

  // authentication actions
  LOGOUT: "logout",
  REFRESH_TOKEN: "refresh_token",
  REVOKE_TOKEN: "revoke_token",

  // admin users actions
  ASSIGN_ROLE: "assign_role",
  READ_ALL_USERS: "read_all",
  READ_ONE_USER: "read_one",
  LOCK_USER: "lock_user",

  // auth resource actions
  ME: "me",
} as const;

export default APP_ACTIONS;
