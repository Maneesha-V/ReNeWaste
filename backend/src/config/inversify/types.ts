const TYPES = {
//controllers
  SuperAdminAuthController: Symbol.for("SuperAdminAuthController"),

//services
  SuperAdminAuthService: Symbol.for("SuperAdminAuthService"),

//repositories
//   ISuperAdminRepository: Symbol.for("ISuperAdminRepository"),
  SuperAdminRepository: Symbol.for("SuperAdminRepository"),
  UserRepository: Symbol.for("UserRepository"),
  OtpRepository: Symbol.for("OtpRepository"),
};

export default TYPES;
