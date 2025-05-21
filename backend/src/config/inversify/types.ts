const TYPES = {
//--controllers--
//superadmin
  SuperAdminAuthController: Symbol.for("SuperAdminAuthController"),
  SuperAdminPlantController: Symbol.for("SuperAdminPlantController"),
  SuperAdminDashboardController: Symbol.for("SuperAdminDashboardController"),
//user
  UserAuthController: Symbol.for("UserAuthController"),
  UserProfileController: Symbol.for("UserProfileController"),
  ResidentialController: Symbol.for("ResidentialController"),
  CommercialController: Symbol.for("CommercialController"),
  UserPickupController: Symbol.for("UserPickupController"),
  UserPaymentController: Symbol.for("UserPaymentController"),
  UserDropSpotController: Symbol.for("UserDropSpotController"),
//wasteplant

//driver
//--services--

//superadmin
  SuperAdminAuthService: Symbol.for("SuperAdminAuthService"),
  SuperAdminPlantService: Symbol.for("SuperAdminPlantService"),
  SuperAdminDashboardService: Symbol.for("SuperAdminDashboardService"),
//user
  UserAuthService: Symbol.for("UserAuthService"),
  UserProfileService: Symbol.for("UserProfileService"),
  ResidentialService: Symbol.for("ResidentialService"),
  CommercialService: Symbol.for("CommercialService"),
  UserPickupService: Symbol.for("UserPickupService"),
  UserPaymentService: Symbol.for("UserPaymentService"),
  UserDropSpotService: Symbol.for("UserDropSpotService"),
//wasteplant

//driver

//--repositories--

  SuperAdminRepository: Symbol.for("SuperAdminRepository"),
  UserRepository: Symbol.for("UserRepository"),
  OtpRepository: Symbol.for("OtpRepository"),
  WastePlantRepository: Symbol.for("WastePlantRepository"),
  PickupRepository: Symbol.for("PickupRepository"),
  DropSpotRepository: Symbol.for("DropSpotRepository"),
};

export default TYPES;
