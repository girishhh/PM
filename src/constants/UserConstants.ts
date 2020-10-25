enum ROLES {
  ADMIN = "admin",
  SUPER_ADMIN = "superAdmin",
  OWNER = "owner",
  DELIVERY_BOY = "deliveryBoy",
}

const ROLES_NEEDS_PASSWORD_MAIL = ["admin", "owner", "deliveryBoy"];

export { ROLES, ROLES_NEEDS_PASSWORD_MAIL };
