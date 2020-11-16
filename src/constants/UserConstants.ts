enum ROLES {
  ADMIN = "admin",
  SUPER_ADMIN = "superAdmin",
  OWNER = "owner",
  DELIVERY_BOY = "deliveryBoy",
  CUSTOMER = "customer",
}

enum PERMISSIONS {
  CREATE_ADMIN = "createAdmin",
  CREATE_OWNER = "createOwner",
  CREATE_DELIVERY_BOY = "createDeliveryBoy",
}

const ROLES_NEEDS_PASSWORD_MAIL = ["admin", "owner", "deliveryBoy"];

export { ROLES, ROLES_NEEDS_PASSWORD_MAIL };
