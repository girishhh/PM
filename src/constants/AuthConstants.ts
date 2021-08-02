export const EMAIL_VALIDATION_REGEXP = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const PWD_VALIDATION_REGEXP = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
export const PUBLIC_ROUTES = [
  "/users/sign-in",
  "/users/activate-account",
  "/users/sign-up",
  "/users/resend-confirmation-instructions"  
];

export const NON_SUBDOMAIN_ROUTES = ["/api-docs/"]

export const SUPER_ADMIN_DOMAINS = ["super-admin"];
