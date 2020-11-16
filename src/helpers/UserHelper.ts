import loadash from "lodash";

const getPermissionName = (action: string, role: string): string => {
  return loadash.camelCase(`${action} ${role}`);
};

const allowed = (
  currentPermissions: string[],
  actionPermission: string
): boolean => {
  return currentPermissions.includes(actionPermission);
};

export { getPermissionName, allowed };
