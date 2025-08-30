import { useMe } from "@/context/me.context";
import { PermissionArg } from "@/models";

export const useHasPermission = (permissions: PermissionArg[]): boolean[] => {
  const meContext = useMe();

  if (!meContext || !meContext?.me) {
    return permissions.map(() => false);
  }

  return permissions.map((permission) =>
    meContext.me?.Permissions?.some(
      (userPermission) =>
        userPermission.resource === permission.resource &&
        userPermission.actions.includes(permission.action)
    ) ?? false
  );
};

