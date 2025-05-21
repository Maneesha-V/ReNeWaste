import { Container } from "inversify";
import TYPES from "./types";

//-- Controllers & their interfaces --
//superadmin
import { AuthController } from "../../controllers/superAdmin/authController";
import { IAuthController } from "../../controllers/superAdmin/interface/IAuthController";
import { IWastePlantController } from "../../controllers/superAdmin/interface/IWastePlantController";
import { WastePlantController } from "../../controllers/superAdmin/wastePlantController";
import { IDashboardController } from "../../controllers/superAdmin/interface/IDashboardController";
import { DashboardController } from "../../controllers/superAdmin/dashboardController";
//user
import { UserController } from "../../controllers/user/userController";
import { IUserController } from "../../controllers/user/interface/IUserController";
import { IProfileController } from "../../controllers/user/interface/IProfileController";
import { ProfileController } from "../../controllers/user/profileController"; 
import { IResidentialController } from "../../controllers/user/interface/IResidentialController";
import { ResidentialController } from "../../controllers/user/residentialController";
import { ICommercialController } from "../../controllers/user/interface/ICommercialController";
import { CommercialController } from "../../controllers/user/commercialController";
import { IPickupController } from "../../controllers/user/interface/IPickupController";
import { PickupController } from "../../controllers/user/pickupController";
import { IPaymentController } from "../../controllers/user/interface/IPaymentController";
import { PaymentController } from "../../controllers/user/paymentController";
import { IDropSpotController } from "../../controllers/user/interface/IDropSpotController";
import { DropSpotController } from "../../controllers/user/dropSpotController";

//-- Services & their interfaces --
//superadmin
import { SuperAdminAuthService } from "../../services/superAdmin/authService";
import { ISuperAdminAuthService } from "../../services/superAdmin/interface/IAuthService";
import { IWastePlantService } from "../../services/superAdmin/interface/IWastePlantService";
import { WastePlantService } from "../../services/superAdmin/wastePlantService";
import { IDashboardService } from "../../services/superAdmin/interface/IDashboardService";
import { DashboardService } from "../../services/superAdmin/dashboardService";

//user
import { IAuthService } from "../../services/user/interface/IAuthService";
import { AuthService } from "../../services/user/authService";
import { IResidentialService } from "../../services/user/interface/IResidentialService";
import { ResidentialService } from "../../services/user/residentialService";
import { IPickupService } from "../../services/user/interface/IPIckupService";
import { PickupService } from "../../services/user/pickupService";
import { ICommercialService } from "../../services/user/interface/ICommercialService";
import { CommercialService } from "../../services/user/commercialService";
import { IPaymentService } from "../../services/user/interface/IPaymentService";
import { PaymentService } from "../../services/user/paymentService";
import { IProfileService } from "../../services/user/interface/IProfileService";
import { ProfileService } from "../../services/user/profileService";
import { IDropSpotService } from "../../services/user/interface/IDropSpotservice";
import { DropSpotService } from "../../services/user/dropSpotService";
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



//Create the container
const container = new Container();

//--Bind Controllers--
//superadmin
container.bind<IAuthController>(TYPES.SuperAdminAuthController).to(AuthController);
container.bind<IWastePlantController>(TYPES.SuperAdminPlantController).to(WastePlantController);
container.bind<IDashboardController>(TYPES.SuperAdminDashboardController).to(DashboardController);
//user
container.bind<IUserController>(TYPES.UserAuthController).to(UserController);
container.bind<IProfileController>(TYPES.UserProfileController).to(ProfileController);
container.bind<IResidentialController>(TYPES.ResidentialController).to(ResidentialController);
container.bind<ICommercialController>(TYPES.CommercialController).to(CommercialController);
container.bind<IPickupController>(TYPES.UserPickupController).to(PickupController);
container.bind<IPaymentController>(TYPES.UserPaymentController).to(PaymentController);
container.bind<IDropSpotController>(TYPES.UserDropSpotController).to(DropSpotController);
//wasteplant
//driver

//--Bind Services--
//superadmin
container.bind<ISuperAdminAuthService>(TYPES.SuperAdminAuthService).to(SuperAdminAuthService);
container.bind<IWastePlantService>(TYPES.SuperAdminPlantService).to(WastePlantService);
container.bind<IDashboardService>(TYPES.SuperAdminDashboardService).to(DashboardService);
//user
container.bind<IAuthService>(TYPES.UserAuthService).to(AuthService);
container.bind<IProfileService>(TYPES.UserProfileService).to(ProfileService);
container.bind<IResidentialService>(TYPES.ResidentialService).to(ResidentialService);
container.bind<ICommercialService>(TYPES.CommercialService).to(CommercialService);
container.bind<IPickupService>(TYPES.UserPickupService).to(PickupService);
container.bind<IPaymentService>(TYPES.UserPaymentService).to(PaymentService);
container.bind<IDropSpotService>(TYPES.UserDropSpotService).to(DropSpotService);
//wasteplant
//driver

//--Bind Repositories--
container.bind<ISuperAdminRepository>(TYPES.SuperAdminRepository).to(SuperAdminRepository);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IOtpRepository>(TYPES.OtpRepository).to(OtpRepository);
container.bind<IPickupRepository>(TYPES.PickupRepository).to(PickupRepository);
container.bind<IDropSpotRepository>(TYPES.DropSpotRepository).to(DropSpotRepository);
container.bind<IWastePlantRepository>(TYPES.WastePlantRepository).to(WastePlantRepository);

export default container;