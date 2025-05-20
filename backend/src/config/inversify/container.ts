import { Container } from "inversify";
import TYPES from "./types";

//-- Controllers & their interfaces --
import { AuthController } from "../../controllers/superAdmin/authController";
import { IAuthController } from "../../controllers/superAdmin/interface/IAuthController";


//-- Services & their interfaces --
import { SuperAdminAuthService } from "../../services/superAdmin/authService";
import { ISuperAdminAuthService } from "../../services/superAdmin/interface/IAuthService";

//-- Repositories & their interfaces --
import { SuperAdminRepository } from "../../repositories/superAdmin/superAdminRepository";
import { ISuperAdminRepository } from "../../repositories/superAdmin/interface/ISuperAdminRepository";
import { UserRepository } from "../../repositories/user/userRepository";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";
import { OtpRepository } from "../../repositories/otp/otpRepository";
import { IOtpRepository } from "../../repositories/otp/interface/IOTPRepository";

//Create the container
const container = new Container();

// Bind Controllers
container.bind<IAuthController>(TYPES.SuperAdminAuthController).to(AuthController);

// Bind Services
container.bind<ISuperAdminAuthService>(TYPES.SuperAdminAuthService).to(SuperAdminAuthService);

// Bind Repositories
container.bind<ISuperAdminRepository>(TYPES.SuperAdminRepository).to(SuperAdminRepository);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IOtpRepository>(TYPES.OtpRepository).to(OtpRepository);

export default container;