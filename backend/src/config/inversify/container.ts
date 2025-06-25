import { Container } from "inversify";
import TYPES from "./types";

//-- Controllers & their interfaces --
//superadmin
import { AuthController as SuprAdminAuthController } from "../../controllers/superAdmin/authController";
import { IAuthController as ISuprAdminAuthController } from "../../controllers/superAdmin/interface/IAuthController";
import { IWastePlantController as ISuprAdminPlantController } from "../../controllers/superAdmin/interface/IWastePlantController";
import { WastePlantController as SuprAdminPlantController } from "../../controllers/superAdmin/wastePlantController";
import { IDashboardController as ISuprAdminDashBrdController } from "../../controllers/superAdmin/interface/IDashboardController";
import { DashboardController as SuprAdminDashBrdController } from "../../controllers/superAdmin/dashboardController";
import { INotificationController as ISuprAdminNotificationController } from "../../controllers/superAdmin/interface/INotificationController";
import { NotificationController as SuprAdminNotificationController } from "../../controllers/superAdmin/notificationController";
import { ISubscriptionController as ISuprAdminSubscriptionController } from "../../controllers/superAdmin/interface/ISubscriptionController";
import { SubscriptionController as SuprAdminSubscriptionController } from "../../controllers/superAdmin/subscriptionController";
import { IPaymentController as ISuprAdminPaymentController } from "../../controllers/superAdmin/interface/IPaymentController";
import { PaymentController as SuprAdminPaymentController } from "../../controllers/superAdmin/paymentController";
//user
import { UserController } from "../../controllers/user/userController";
import { IUserController } from "../../controllers/user/interface/IUserController";
import { IProfileController as IUserProfileController } from "../../controllers/user/interface/IProfileController";
import { ProfileController as UserProfileController } from "../../controllers/user/profileController"; 
import { IResidentialController } from "../../controllers/user/interface/IResidentialController";
import { ResidentialController } from "../../controllers/user/residentialController";
import { ICommercialController } from "../../controllers/user/interface/ICommercialController";
import { CommercialController } from "../../controllers/user/commercialController";
import { IPickupController as IUserPickupController } from "../../controllers/user/interface/IPickupController";
import { PickupController as UserPickupController } from "../../controllers/user/pickupController";
import { IPaymentController as IUserPaymentController } from "../../controllers/user/interface/IPaymentController";
import { PaymentController as UserPaymentController } from "../../controllers/user/paymentController";
import { IDropSpotController as IUserDropSpotController } from "../../controllers/user/interface/IDropSpotController";
import { DropSpotController as UserDropSpotController } from "../../controllers/user/dropSpotController";
import { INotificationController as IUserNotificationController } from "../../controllers/user/interface/INotificationController";
import { NotificationController as UserNotificationController } from "../../controllers/user/notificationController";

//wasteplant
import { AuthController as PlantAuthController } from "../../controllers/wastePlant/authController";
import { IAuthController as IPlantAuthController } from "../../controllers/wastePlant/interface/IAuthController";
import { IChatController as IPlantChatController } from "../../controllers/wastePlant/interface/IChatController";
import { ChatController as PlantChatController } from "../../controllers/wastePlant/chatController";
import { IDriverController as IPlantDriverController } from "../../controllers/wastePlant/interface/IDriverController";
import { DriverController as PlantDriverController } from "../../controllers/wastePlant/driverController";
import { IDropSpotController as IPlantDropSpotController } from "../../controllers/wastePlant/interface/IDropSpotController";
import { DropSpotController as PlantDropSpotController } from "../../controllers/wastePlant/dropSpotController";
import { IPickupController as IPlantPickupController } from "../../controllers/wastePlant/interface/IPickupController";
import { PickupController as PlantPickupController } from "../../controllers/wastePlant/pickupController";
import { ITruckController as IPlantTruckController } from "../../controllers/wastePlant/interface/ITruckController";
import { TruckController as PlantTruckController } from "../../controllers/wastePlant/truckController";
import { IUserController as IPlantUserController } from "../../controllers/wastePlant/interface/IUserController";
import { UserController as PlantUserController } from "../../controllers/wastePlant/userController";
import { INotificationController as IPlantNotificationController } from "../../controllers/wastePlant/interface/INotificationController";
import { NotificationController as PlantNotificationController } from "../../controllers/wastePlant/notificationController";
import { ISubscriptionController as IPlantSubscriptionController } from "../../controllers/wastePlant/interface/ISubscriptionController";
import { SubscriptionController as PlantSubscriptionController } from "../../controllers/wastePlant/subscriptionController";
import { IPaymentController as IPlantPaymentController } from "../../controllers/wastePlant/interface/IPaymentController";
import { PaymentController as PlantPaymentController } from "../../controllers/wastePlant/paymentController";
import { IDashboardController as IPlantDashboardController } from "../../controllers/wastePlant/interface/IDashboardController";
import { DashboardController as PlantDashboardController } from "../../controllers/wastePlant/dashboardController";
import { ReportController as PlantReportController } from "../../controllers/wastePlant/reportController";
import { IReportController as IPlantReportController } from "../../controllers/wastePlant/interface/IReportController";
import { IProfileController as IPlantProfileController } from "../../controllers/wastePlant/interface/IProfileController";
import { ProfileController as PlantProfileController } from "../../controllers/wastePlant/profileController";

//driver
import { IAuthController as IDriverAuthController } from "../../controllers/driver/interface/IAuthController";
import { AuthController as DriverAuthController } from "../../controllers/driver/authController";
import { IChatController as IDriverChatController } from "../../controllers/driver/interface/IChatController";
import { ChatController as DriverChatController } from "../../controllers/driver/chatController";
import { IProfileController as IDriverProfileController } from "../../controllers/driver/interface/IProfileController";
import { ProfileController as DriverProfileController } from "../../controllers/driver/profileController";
import { IPickupController as IDriverPickupController } from "../../controllers/driver/interface/IPIckupController";
import { PickupController as DriverPickupController } from "../../controllers/driver/pickupController";
import { ITruckController as IDriverTruckController } from "../../controllers/driver/interface/ITruckController";
import { TruckController as DriverTruckController } from "../../controllers/driver/truckController";
import { IMapController as IDriverMapController } from "../../controllers/driver/interface/IMapController";
import { MapController as DriverMapController } from "../../controllers/driver/mapController";
import { INotificationController as IDriverNotificationController } from "../../controllers/driver/interface/INotificationController";
import { NotificationController as DriverNotificationController } from "../../controllers/driver/notificationController";
//-- Services & their interfaces --

//superadmin
import { SuperAdminAuthService } from "../../services/superAdmin/authService";
import { ISuperAdminAuthService } from "../../services/superAdmin/interface/IAuthService";
import { IWastePlantService as ISuprAdminPlantService } from "../../services/superAdmin/interface/IWastePlantService";
import { WastePlantService as SuprAdminPlantService } from "../../services/superAdmin/wastePlantService";
import { IDashboardService as ISuprAdminDashBrdService } from "../../services/superAdmin/interface/IDashboardService";
import { DashboardService as SuprAdminDashBrdService } from "../../services/superAdmin/dashboardService";
import { INotificationService as ISuprAdminNotificationService } from "../../services/superAdmin/interface/INotificationService";
import { NotificationService as SuprAdminNotificationService } from "../../services/superAdmin/notificationService";
import { ISubscriptionService as ISuprAdminSubsciptionService } from "../../services/superAdmin/interface/ISubscriptionService";
import { SubscriptionService as SuprAdminSubsciptionService } from "../../services/superAdmin/subscriptionService";
import { IPaymentService as ISuprAdminPaymentService } from "../../services/superAdmin/interface/IPaymentService";
import { PaymentService as SuprAdminPaymentService } from "../../services/superAdmin/paymentService";

//user
import { IAuthService as IUserAuthService } from "../../services/user/interface/IAuthService";
import { AuthService as UserAuthService } from "../../services/user/authService";
import { IResidentialService } from "../../services/user/interface/IResidentialService";
import { ResidentialService } from "../../services/user/residentialService";
import { IPickupService as IUserPickupService } from "../../services/user/interface/IPIckupService";
import { PickupService as UserPickupService } from "../../services/user/pickupService";
import { ICommercialService } from "../../services/user/interface/ICommercialService";
import { CommercialService } from "../../services/user/commercialService";
import { IPaymentService as IUserPaymentService } from "../../services/user/interface/IPaymentService";
import { PaymentService as UserPaymentService } from "../../services/user/paymentService";
import { IProfileService as IUserProfileService } from "../../services/user/interface/IProfileService";
import { ProfileService as UserProfileService } from "../../services/user/profileService";
import { IDropSpotService as IUserDropSpotService } from "../../services/user/interface/IDropSpotservice";
import { DropSpotService as UserDropSpotService } from "../../services/user/dropSpotService";
import { INotificationService as IUserNotificationService } from "../../services/user/interface/INotificationService";
import { NotificationService as UserNotificationService } from "../../services/user/notificationService";

//wasteplant
import { IAuthService as IPlantAuthService } from "../../services/wastePlant/interface/IAuthService";
import { AuthService as PlantAuthService } from "../../services/wastePlant/authService";
import { IChatService as IPlantChatService} from "../../services/wastePlant/interface/IChatService";
import { ChatService as PlantChatService } from "../../services/wastePlant/chatService";
import { IDriverService as IPlantDriverService } from "../../services/wastePlant/interface/IDriverService";
import { DriverService as PlantDriverService } from "../../services/wastePlant/driverService";
import { IDropSpotService as IPlantDropSpotService } from "../../services/wastePlant/interface/IDropSpotService";
import { DropSpotService as PlantDropSpotService } from "../../services/wastePlant/dropSpotService";
import { IPickupService as IPlantPickupService } from "../../services/wastePlant/interface/IPickupService";
import { PickupService as PlantPickupService } from "../../services/wastePlant/pickupService";
import { ITruckService as IPlantTruckService } from "../../services/wastePlant/interface/ITruckService";
import { TruckService as PlantTruckService } from "../../services/wastePlant/truckService";
import { IUserService as IPlantUserService } from "../../services/wastePlant/interface/IUserService";
import { UserService as PlantUserService } from "../../services/wastePlant/userService";
import { INotificationService as IPlantNotificationService } from "../../services/wastePlant/interface/INotificationService";
import { NotificationService as PlantNotificationService } from "../../services/wastePlant/notificationService";
import { ISubscriptionService as IPlantSubscriptionService } from "../../services/wastePlant/interface/ISubscriptionService";
import { SubscriptionService as PlantSubscriptionService } from "../../services/wastePlant/subscriptionService";
import { IPaymentService as IPlantPaymentService } from "../../services/wastePlant/interface/IPaymentService";
import { PaymentService as PlantPaymentService } from "../../services/wastePlant/paymentService";
import { IDashboardService as IPlantDashboardService } from "../../services/wastePlant/interface/IDashboardService";
import { DashboardService as PlantDashboardService } from "../../services/wastePlant/dashboardService";
import { IReportService as IPlantReportService } from "../../services/wastePlant/interface/IReportService";
import { ReportService as PlantReportService } from "../../services/wastePlant/reportService";
import { IProfileService as IPlantProfileService } from "../../services/wastePlant/interface/IProfileService";
import { ProfileService as PlantProfileService } from "../../services/wastePlant/profileService";

//driver
import { IAuthService as IDriverAuthService } from "../../services/driver/interface/IAuthService";
import { AuthService as DriverAuthService  } from "../../services/driver/authService";
import { IChatService as IDriverChatService } from "../../services/driver/interface/IChatService";
import { ChatService as DriverChatService } from "../../services/driver/chatService";
import { IProfileService as IDriverProfileService } from "../../services/driver/interface/IProfileService";
import { ProfileService as DriverProfileService } from "../../services/driver/profileService";
import { IPickupService as IDriverPickupService } from "../../services/driver/interface/IPickupService";
import { PickupService as DriverPickupService } from "../../services/driver/pickupService";
import { ITruckService as IDriverTruckService } from "../../services/driver/interface/ITruckService";
import { TruckService as DriverTruckService } from "../../services/driver/truckService";
import { IMapService as IDriverMapService } from "../../services/driver/interface/IMapService";
import { MapService as DriverMapService  } from "../../services/driver/mapService";
import { INotificationService as IDriverNotificationService } from "../../services/driver/interface/INotificationService";
import { NotificationService as DriverNotificationService } from "../../services/driver/notificationService";

//-- Repositories & their interfaces --
import { SuperAdminRepository } from "../../repositories/superAdmin/superAdminRepository";
import { ISuperAdminRepository } from "../../repositories/superAdmin/interface/ISuperAdminRepository";
import { UserRepository } from "../../repositories/user/userRepository";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";
import { OtpRepository } from "../../repositories/otp/otpRepository";
import { IOtpRepository } from "../../repositories/otp/interface/IOtpRepository";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import { PickupRepository } from "../../repositories/pickupReq/pickupRepository";
import { IDropSpotRepository } from "../../repositories/dropSpot/interface/IDropSpotRepository";
import { DropSpotRepository } from "../../repositories/dropSpot/dropSpotRepository";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";
import { WastePlantRepository } from "../../repositories/wastePlant/wastePlantRepository";
import { ITruckRepository } from "../../repositories/truck/interface/ITruckRepository";
import { TruckRepository } from "../../repositories/truck/truckRepository";
import { IDriverRepository } from "../../repositories/driver/interface/IDriverRepository"; 
import { DriverRepository } from "../../repositories/driver/driverRepository";
import { IChatMsgRepository } from "../../repositories/chat/interface/IChatMsgRepository";
import { ChatMsgRepository } from "../../repositories/chat/chatMsgRepository";
import { IConversationRepository } from "../../repositories/chat/interface/IConversation";
import { ConversationRepository } from "../../repositories/chat/conversationRepository";
import { INotificationRepository } from "../../repositories/notification/interface/INotifcationRepository";
import { NotificationRepository } from "../../repositories/notification/notificationRepository";
import { IWasteCollectionRepository } from "../../repositories/wasteCollection/interface/IWasteCollectionRepository";
import { WasteCollectionRepository } from "../../repositories/wasteCollection/wasteCollectionRepository";
import { ISubscriptionPlanRepository } from "../../repositories/subscriptionPlan/interface/ISubscriptionPlanRepository";
import { SubscriptionPlanRepository } from "../../repositories/subscriptionPlan/subscriptionPlanRepository";
import { ISubscriptionPaymentRepository } from "../../repositories/subscriptionPayment/interface/ISubscriptionPaymentRepository";
import { SubscriptionPaymentRepository } from "../../repositories/subscriptionPayment/subscriptionPaymentRepository";



//Create the container
const container = new Container();

//--Bind Controllers--
//superadmin
container.bind<ISuprAdminAuthController>(TYPES.SuperAdminAuthController).to(SuprAdminAuthController);
container.bind<ISuprAdminPlantController>(TYPES.SuperAdminPlantController).to(SuprAdminPlantController);
container.bind<ISuprAdminDashBrdController>(TYPES.SuperAdminDashboardController).to(SuprAdminDashBrdController);
container.bind<ISuprAdminNotificationController>(TYPES.SuperAdminNotificationController).to(SuprAdminNotificationController);
container.bind<ISuprAdminSubscriptionController>(TYPES.SuperAdminSubscriptionController).to(SuprAdminSubscriptionController);
container.bind<ISuprAdminPaymentController>(TYPES.SuperAdminPaymentController).to(SuprAdminPaymentController);
//user
container.bind<IUserController>(TYPES.UserAuthController).to(UserController);
container.bind<IUserProfileController>(TYPES.UserProfileController).to(UserProfileController);
container.bind<IResidentialController>(TYPES.ResidentialController).to(ResidentialController);
container.bind<ICommercialController>(TYPES.CommercialController).to(CommercialController);
container.bind<IUserPickupController>(TYPES.UserPickupController).to(UserPickupController);
container.bind<IUserPaymentController>(TYPES.UserPaymentController).to(UserPaymentController);
container.bind<IUserDropSpotController>(TYPES.UserDropSpotController).to(UserDropSpotController);
container.bind<IUserNotificationController>(TYPES.UserNotificationController).to(UserNotificationController);

//wasteplant
container.bind<IPlantAuthController>(TYPES.PlantAuthController).to(PlantAuthController);
container.bind<IPlantChatController>(TYPES.PlantChatController).to(PlantChatController);
container.bind<IPlantDriverController>(TYPES.PlantDriverController).to(PlantDriverController);
container.bind<IPlantDropSpotController>(TYPES.PlantDropSpotController).to(PlantDropSpotController);
container.bind<IPlantPickupController>(TYPES.PlantPickupController).to(PlantPickupController);
container.bind<IPlantTruckController>(TYPES.PlantTruckController).to(PlantTruckController);
container.bind<IPlantUserController>(TYPES.PlantUserController).to(PlantUserController);
container.bind<IPlantNotificationController>(TYPES.PlantNotificationController).to(PlantNotificationController);
container.bind<IPlantSubscriptionController>(TYPES.PlantSubscriptionController).to(PlantSubscriptionController);
container.bind<IPlantPaymentController>(TYPES.PlantPaymentController).to(PlantPaymentController);
container.bind<IPlantDashboardController>(TYPES.PlantDashboardController).to(PlantDashboardController);
container.bind<IPlantReportController>(TYPES.PlantReportController).to(PlantReportController);
container.bind<IPlantProfileController>(TYPES.PlantProfileController).to(PlantProfileController);

//driver
container.bind<IDriverAuthController>(TYPES.DriverAuthController).to(DriverAuthController);
container.bind<IDriverChatController>(TYPES.DriverChatController).to(DriverChatController);
container.bind<IDriverProfileController>(TYPES.DriverProfileController).to(DriverProfileController);
container.bind<IDriverPickupController>(TYPES.DriverPickupController).to(DriverPickupController);
container.bind<IDriverTruckController>(TYPES.DriverTruckController).to(DriverTruckController);
container.bind<IDriverMapController>(TYPES.DriverMapController).to(DriverMapController);
container.bind<IDriverNotificationController>(TYPES.DriverNotificationController).to(DriverNotificationController);

//--Bind Services--

//superadmin
container.bind<ISuperAdminAuthService>(TYPES.SuperAdminAuthService).to(SuperAdminAuthService);
container.bind<ISuprAdminPlantService>(TYPES.SuperAdminPlantService).to(SuprAdminPlantService);
container.bind<ISuprAdminDashBrdService>(TYPES.SuperAdminDashboardService).to(SuprAdminDashBrdService);
container.bind<ISuprAdminNotificationService>(TYPES.SuperAdminNotificationService).to(SuprAdminNotificationService);
container.bind<ISuprAdminSubsciptionService>(TYPES.SuperAdminSubscriptionService).to(SuprAdminSubsciptionService);
container.bind<ISuprAdminPaymentService>(TYPES.SuperAdminPaymentService).to(SuprAdminPaymentService);

//user  
container.bind<IUserAuthService>(TYPES.UserAuthService).to(UserAuthService);
container.bind<IUserProfileService>(TYPES.UserProfileService).to(UserProfileService);
container.bind<IResidentialService>(TYPES.ResidentialService).to(ResidentialService);
container.bind<ICommercialService>(TYPES.CommercialService).to(CommercialService);
container.bind<IUserPickupService>(TYPES.UserPickupService).to(UserPickupService);
container.bind<IUserPaymentService>(TYPES.UserPaymentService).to(UserPaymentService);
container.bind<IUserDropSpotService>(TYPES.UserDropSpotService).to(UserDropSpotService);
container.bind<IUserNotificationService>(TYPES.UserNotificationService).to(UserNotificationService);

//wasteplant
container.bind<IPlantAuthService>(TYPES.PlantAuthService).to(PlantAuthService);
container.bind<IPlantChatService>(TYPES.PlantChatService).to(PlantChatService);
container.bind<IPlantDriverService>(TYPES.PlantDriverService).to(PlantDriverService);
container.bind<IPlantDropSpotService>(TYPES.PlantDropSpotService).to(PlantDropSpotService);
container.bind<IPlantPickupService>(TYPES.PlantPickupService).to(PlantPickupService);
container.bind<IPlantTruckService>(TYPES.PlantTruckService).to(PlantTruckService);
container.bind<IPlantUserService>(TYPES.PlantUserService).to(PlantUserService);
container.bind<IPlantNotificationService>(TYPES.PlantNotificationService).to(PlantNotificationService);
container.bind<IPlantSubscriptionService>(TYPES.PlantSubscriptionService).to(PlantSubscriptionService);
container.bind<IPlantPaymentService>(TYPES.PlantPaymentService).to(PlantPaymentService);
container.bind<IPlantDashboardService>(TYPES.PlantDashboardService).to(PlantDashboardService);
container.bind<IPlantReportService>(TYPES.PlantReportService).to(PlantReportService);
container.bind<IPlantProfileService>(TYPES.PlantProfileService).to(PlantProfileService);

//driver
container.bind<IDriverAuthService>(TYPES.DriverAuthService).to(DriverAuthService);
container.bind<IDriverChatService>(TYPES.DriverChatService).to(DriverChatService);
container.bind<IDriverProfileService>(TYPES.DriverProfileService).to(DriverProfileService);
container.bind<IDriverPickupService>(TYPES.DriverPickupService).to(DriverPickupService);
container.bind<IDriverTruckService>(TYPES.DriverTruckService).to(DriverTruckService);
container.bind<IDriverMapService>(TYPES.DriverMapService).to(DriverMapService);
container.bind<IDriverNotificationService>(TYPES.DriverNotificationService).to(DriverNotificationService);

//--Bind Repositories--
container.bind<ISuperAdminRepository>(TYPES.SuperAdminRepository).to(SuperAdminRepository);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IOtpRepository>(TYPES.OtpRepository).to(OtpRepository);
container.bind<IPickupRepository>(TYPES.PickupRepository).to(PickupRepository);
container.bind<IDropSpotRepository>(TYPES.DropSpotRepository).to(DropSpotRepository);
container.bind<IWastePlantRepository>(TYPES.WastePlantRepository).to(WastePlantRepository);
container.bind<IChatMsgRepository>(TYPES.ChatMsgRepository).to(ChatMsgRepository);
container.bind<IConversationRepository>(TYPES.ConversationRepository).to(ConversationRepository);
container.bind<ITruckRepository>(TYPES.TruckRepository).to(TruckRepository).inSingletonScope();
container.bind<IDriverRepository>(TYPES.DriverRepository).to(DriverRepository).inSingletonScope();
container.bind<INotificationRepository>(TYPES.NotificationRepository).to(NotificationRepository);
container.bind<IWasteCollectionRepository>(TYPES.WasteCollectionRepository).to(WasteCollectionRepository);
container.bind<ISubscriptionPlanRepository>(TYPES.SubscriptionPlanRepository).to(SubscriptionPlanRepository);
container.bind<ISubscriptionPaymentRepository>(TYPES.SubscriptionPaymentRepository).to(SubscriptionPaymentRepository);

// Bind factory for circular dep
container.bind<() => IDriverRepository>(TYPES.DriverRepositoryFactory)
  .toFactory(() => {
    return () => container.get<IDriverRepository>(TYPES.DriverRepository);  
  });
container
  .bind<() => ITruckRepository>(TYPES.TruckRepositoryFactory)
  .toFactory(() => {
    return () => container.get<ITruckRepository>(TYPES.TruckRepository);
});


export default container;