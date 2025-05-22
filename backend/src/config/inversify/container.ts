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
//driver

//-- Services & their interfaces --
//superadmin
import { SuperAdminAuthService } from "../../services/superAdmin/authService";
import { ISuperAdminAuthService } from "../../services/superAdmin/interface/IAuthService";
import { IWastePlantService as ISuprAdminPlantService } from "../../services/superAdmin/interface/IWastePlantService";
import { WastePlantService as SuprAdminPlantService } from "../../services/superAdmin/wastePlantService";
import { IDashboardService as ISuprAdminDashBrdService } from "../../services/superAdmin/interface/IDashboardService";
import { DashboardService as SuprAdminDashBrdService } from "../../services/superAdmin/dashboardService";

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

//driver

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


//Create the container
const container = new Container();

//--Bind Controllers--
//superadmin
container.bind<ISuprAdminAuthController>(TYPES.SuperAdminAuthController).to(SuprAdminAuthController);
container.bind<ISuprAdminPlantController>(TYPES.SuperAdminPlantController).to(SuprAdminPlantController);
container.bind<ISuprAdminDashBrdController>(TYPES.SuperAdminDashboardController).to(SuprAdminDashBrdController);
//user
container.bind<IUserController>(TYPES.UserAuthController).to(UserController);
container.bind<IUserProfileController>(TYPES.UserProfileController).to(UserProfileController);
container.bind<IResidentialController>(TYPES.ResidentialController).to(ResidentialController);
container.bind<ICommercialController>(TYPES.CommercialController).to(CommercialController);
container.bind<IUserPickupController>(TYPES.UserPickupController).to(UserPickupController);
container.bind<IUserPaymentController>(TYPES.UserPaymentController).to(UserPaymentController);
container.bind<IUserDropSpotController>(TYPES.UserDropSpotController).to(UserDropSpotController);
//wasteplant
container.bind<IPlantAuthController>(TYPES.PlantAuthController).to(PlantAuthController);
container.bind<IPlantChatController>(TYPES.PlantChatController).to(PlantChatController);
container.bind<IPlantDriverController>(TYPES.PlantDriverController).to(PlantDriverController);
container.bind<IPlantDropSpotController>(TYPES.PlantDropSpotController).to(PlantDropSpotController);
container.bind<IPlantPickupController>(TYPES.PlantPickupController).to(PlantPickupController);
container.bind<IPlantTruckController>(TYPES.PlantTruckController).to(PlantTruckController);
container.bind<IPlantUserController>(TYPES.PlantUserController).to(PlantUserController);
//driver

//--Bind Services--
//superadmin
container.bind<ISuperAdminAuthService>(TYPES.SuperAdminAuthService).to(SuperAdminAuthService);
container.bind<ISuprAdminPlantService>(TYPES.SuperAdminPlantService).to(SuprAdminPlantService);
container.bind<ISuprAdminDashBrdService>(TYPES.SuperAdminDashboardService).to(SuprAdminDashBrdService);
//user
container.bind<IUserAuthService>(TYPES.UserAuthService).to(UserAuthService);
container.bind<IUserProfileService>(TYPES.UserProfileService).to(UserProfileService);
container.bind<IResidentialService>(TYPES.ResidentialService).to(ResidentialService);
container.bind<ICommercialService>(TYPES.CommercialService).to(CommercialService);
container.bind<IUserPickupService>(TYPES.UserPickupService).to(UserPickupService);
container.bind<IUserPaymentService>(TYPES.UserPaymentService).to(UserPaymentService);
container.bind<IUserDropSpotService>(TYPES.UserDropSpotService).to(UserDropSpotService);
//wasteplant
container.bind<IPlantAuthService>(TYPES.PlantAuthService).to(PlantAuthService);
container.bind<IPlantChatService>(TYPES.PlantChatService).to(PlantChatService);
container.bind<IPlantDriverService>(TYPES.PlantDriverService).to(PlantDriverService);
container.bind<IPlantDropSpotService>(TYPES.PlantDropSpotService).to(PlantDropSpotService);
container.bind<IPlantPickupService>(TYPES.PlantPickupService).to(PlantPickupService);
container.bind<IPlantTruckService>(TYPES.PlantTruckService).to(PlantTruckService);
container.bind<IPlantUserService>(TYPES.PlantUserService).to(PlantUserService);
//driver

//--Bind Repositories--
container.bind<ISuperAdminRepository>(TYPES.SuperAdminRepository).to(SuperAdminRepository);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IOtpRepository>(TYPES.OtpRepository).to(OtpRepository);
container.bind<IPickupRepository>(TYPES.PickupRepository).to(PickupRepository);
container.bind<IDropSpotRepository>(TYPES.DropSpotRepository).to(DropSpotRepository);
container.bind<IWastePlantRepository>(TYPES.WastePlantRepository).to(WastePlantRepository);
container.bind<IChatMsgRepository>(TYPES.ChatMsgRepository).to(ChatMsgRepository);
container.bind<IConversationRepository>(TYPES.ConversationRepository).to(ConversationRepository);
container.bind<ITruckRepository>(TYPES.TruckRepository).to(TruckRepository);
container.bind<IDriverRepository>(TYPES.DriverRepository).to(DriverRepository);
// Bind DriverRepository factory
container.bind<() => IDriverRepository>(TYPES.DriverRepository)
  .toFactory(() => {
    return () => container.get<IDriverRepository>(TYPES.DriverRepository);  
  });

// Bind TruckRepository factory
container
  .bind<() => ITruckRepository>(TYPES.TruckRepository)
  .toFactory(() => {
    return () => container.get<ITruckRepository>(TYPES.TruckRepository);
});


export default container;