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
  PlantAuthController: Symbol.for("PlantAuthController"),
  PlantChatController: Symbol.for("PlantChatController"),
  PlantDriverController: Symbol.for("PlantDriverController"),
  PlantDropSpotController: Symbol.for("PlantDropSpotController"),
  PlantPickupController: Symbol.for("PlantPickupController"),
  PlantTruckController: Symbol.for("PlantTruckController"),
  PlantUserController: Symbol.for("PlantUserController"),
//driver
  DriverAuthController: Symbol.for("DriverAuthController"),
  DriverChatController: Symbol.for("DriverChatController"),
  DriverMapController: Symbol.for("DriverMapController"),
  DriverPickupController: Symbol.for("DriverPickupController"),
  DriverProfileController: Symbol.for("DriverProfileController"),
  DriverTruckController: Symbol.for("DriverTruckController"),

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
  PlantAuthService: Symbol.for("PlantAuthService"),
  PlantChatService: Symbol.for("PlantChatService"),
  PlantDriverService: Symbol.for("PlantDriverService"),
  PlantDropSpotService: Symbol.for("PlantDropSpotService"),
  PlantPickupService: Symbol.for("PlantPickupService"),
  PlantTruckService: Symbol.for("PlantTruckService"),
  PlantUserService: Symbol.for("PlantUserService"),
//driver
  DriverAuthService: Symbol.for("DriverAuthService"),
  DriverChatService: Symbol.for("DriverChatService"),
  DriverMapService: Symbol.for("DriverMapService"),
  DriverPickupService: Symbol.for("DriverPickupService"),
  DriverProfileService: Symbol.for("DriverProfileService"),
  DriverTruckService: Symbol.for("DriverTruckService"),

//--repositories--
  SuperAdminRepository: Symbol.for("SuperAdminRepository"),
  UserRepository: Symbol.for("UserRepository"),
  OtpRepository: Symbol.for("OtpRepository"),
  WastePlantRepository: Symbol.for("WastePlantRepository"),
  PickupRepository: Symbol.for("PickupRepository"),
  DropSpotRepository: Symbol.for("DropSpotRepository"),
  TruckRepository: Symbol.for("TruckRepository"),
  DriverRepository: Symbol.for("DriverRepository"),
  ChatMsgRepository: Symbol.for("ChatMsgRepository"),
  ConversationRepository: Symbol.for("ConversationRepository"),
  NotificationRepository: Symbol.for("NotificationRepository"),
  
  //-factories--
  DriverRepositoryFactory: Symbol.for("DriverRepositoryFactory"),
  TruckRepositoryFactory: Symbol.for("TruckRepositoryFactory"), 

};

export default TYPES;
