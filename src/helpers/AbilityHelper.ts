import { Ability, AbilityBuilder } from "@casl/ability";
import { ROLES } from "../constants/UserConstants";
type Action = "create" | "read" | "update" | "delete";
type Subject =
  | ROLES.ADMIN
  | ROLES.DELIVERY_BOY
  | ROLES.OWNER
  | ROLES.SUPER_ADMIN;

type AppAbility = Ability<[Action, Subject]>;

const { can, rules } = new AbilityBuilder<AppAbility>();

const defineAbilities = (roles: ROLES[]): Ability => {
  for (let i = 0; i < roles.length; i++) {
    switch (roles[i]) {
      case ROLES.ADMIN:
        can("create", ROLES.OWNER);
        break;
      case ROLES.OWNER:
        can("create", ROLES.DELIVERY_BOY);
        break;
      case ROLES.SUPER_ADMIN:
        can("create", ROLES.ADMIN);
        break;
      case ROLES.DELIVERY_BOY:
        break;
    }
  }
  return new Ability(rules);
};

const allowed = (ability: Ability, roles: ROLES[], action: Action): boolean => {
  let allow = true;
  for (let i = 0; i < roles.length; i++) {
    if (!ability.can(action, roles[i])) allow = false;
  }
  return allow;
};

export { defineAbilities, allowed };
