enum ROLES {
  ADMIN = "admin",
  OWNER = "owner",
  COMPANY_ADMIN = "companyAdmin",
  DELIVERY_BOY = "deliveryBoy",
  CUSTOMER = "customer",
}

enum PERMISSIONS {
  CREATE_ADMIN = "createAdmin",
  CREATE_OWNER = "createOwner",
  CREATE_DELIVERY_BOY = "createDeliveryBoy",
}

const ROLES_NEEDS_PASSWORD_MAIL = ["companyAdmin", "owner", "deliveryBoy"];

const USER_ID = "USER_ID";

export { ROLES, ROLES_NEEDS_PASSWORD_MAIL, USER_ID };
