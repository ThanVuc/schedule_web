import { globalConfig } from "../global/global";

const createAPI = (url: string) => `${globalConfig.ApiUrlBase}${url}`;

export const teamGroupApiUrl = {
  list: createAPI("ts/groups"),
  create: createAPI("ts/groups"),
  detail: (groupId: string) => createAPI(`ts/groups/${groupId}`),
  update: (groupId: string) => createAPI(`ts/groups/${groupId}`),
  delete: (groupId: string) => createAPI(`ts/groups/${groupId}`),
};

export const teamMemberApiUrl = {
  list: (groupId: string) => createAPI(`ts/groups/${groupId}/members`),
  updateRole: (groupId: string, memberId: string) =>
    createAPI(`ts/groups/${groupId}/members/${memberId}`),
  remove: (groupId: string, memberId: string) =>
    createAPI(`ts/groups/${groupId}/members/${memberId}`),
  invite: (groupId: string) => createAPI(`ts/groups/${groupId}/invites`),
};

export const teamSprintApiUrl = {
  root: createAPI("ts/sprints"),
  list: (groupId: string) => createAPI(`ts/groups/${groupId}/sprints`),
  create: (groupId: string) => createAPI(`ts/groups/${groupId}/sprints`),
  update: (sprintId: string) => createAPI(`ts/sprints/${sprintId}`),
  delete: (sprintId: string) => createAPI(`ts/sprints/${sprintId}`),
  updateStatus: (sprintId: string) => createAPI(`ts/sprints/${sprintId}/status`),
  generation: (groupId: string) => createAPI(`ts/groups/${groupId}/sprints/generation`),
  export: (groupId: string, sprintId: string) =>
    createAPI(`ts/groups/${groupId}/sprints/${sprintId}/export`),
};
