"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("./types"));
//-- Controllers & their interfaces --
//superadmin
const authController_1 = require("../../controllers/superAdmin/authController");
const wastePlantController_1 = require("../../controllers/superAdmin/wastePlantController");
const dashboardController_1 = require("../../controllers/superAdmin/dashboardController");
const notificationController_1 = require("../../controllers/superAdmin/notificationController");
const subscriptionController_1 = require("../../controllers/superAdmin/subscriptionController");
const paymentController_1 = require("../../controllers/superAdmin/paymentController");
const walletController_1 = require("../../controllers/superAdmin/walletController");
//user
const userController_1 = require("../../controllers/user/userController");
const profileController_1 = require("../../controllers/user/profileController");
const residentialController_1 = require("../../controllers/user/residentialController");
const commercialController_1 = require("../../controllers/user/commercialController");
const pickupController_1 = require("../../controllers/user/pickupController");
const paymentController_2 = require("../../controllers/user/paymentController");
const dropSpotController_1 = require("../../controllers/user/dropSpotController");
const notificationController_2 = require("../../controllers/user/notificationController");
const walletController_2 = require("../../controllers/user/walletController");
const ratingController_1 = require("../../controllers/user/ratingController");
//wasteplant
const authController_2 = require("../../controllers/wastePlant/authController");
const chatController_1 = require("../../controllers/wastePlant/chatController");
const driverController_1 = require("../../controllers/wastePlant/driverController");
const dropSpotController_2 = require("../../controllers/wastePlant/dropSpotController");
const pickupController_2 = require("../../controllers/wastePlant/pickupController");
const truckController_1 = require("../../controllers/wastePlant/truckController");
const userController_2 = require("../../controllers/wastePlant/userController");
const notificationController_3 = require("../../controllers/wastePlant/notificationController");
const subscriptionController_2 = require("../../controllers/wastePlant/subscriptionController");
const paymentController_3 = require("../../controllers/wastePlant/paymentController");
const dashboardController_2 = require("../../controllers/wastePlant/dashboardController");
const reportController_1 = require("../../controllers/wastePlant/reportController");
const profileController_2 = require("../../controllers/wastePlant/profileController");
const walletController_3 = require("../../controllers/wastePlant/walletController");
const authController_3 = require("../../controllers/driver/authController");
const chatController_2 = require("../../controllers/driver/chatController");
const profileController_3 = require("../../controllers/driver/profileController");
const pickupController_3 = require("../../controllers/driver/pickupController");
const truckController_2 = require("../../controllers/driver/truckController");
const mapController_1 = require("../../controllers/driver/mapController");
const notificationController_4 = require("../../controllers/driver/notificationController");
const dashboardController_3 = require("../../controllers/driver/dashboardController");
const walletController_4 = require("../../controllers/driver/walletController");
//-- Services & their interfaces --
//superadmin
const authService_1 = require("../../services/superAdmin/authService");
const wastePlantService_1 = require("../../services/superAdmin/wastePlantService");
const dashboardService_1 = require("../../services/superAdmin/dashboardService");
const notificationService_1 = require("../../services/superAdmin/notificationService");
const subscriptionService_1 = require("../../services/superAdmin/subscriptionService");
const paymentService_1 = require("../../services/superAdmin/paymentService");
const walletService_1 = require("../../services/superAdmin/walletService");
const authService_2 = require("../../services/user/authService");
const residentialService_1 = require("../../services/user/residentialService");
const pickupService_1 = require("../../services/user/pickupService");
const commercialService_1 = require("../../services/user/commercialService");
const paymentService_2 = require("../../services/user/paymentService");
const profileService_1 = require("../../services/user/profileService");
const dropSpotService_1 = require("../../services/user/dropSpotService");
const notificationService_2 = require("../../services/user/notificationService");
const walletService_2 = require("../../services/user/walletService");
const ratingService_1 = require("../../services/user/ratingService");
const authService_3 = require("../../services/wastePlant/authService");
const chatService_1 = require("../../services/wastePlant/chatService");
const driverService_1 = require("../../services/wastePlant/driverService");
const dropSpotService_2 = require("../../services/wastePlant/dropSpotService");
const pickupService_2 = require("../../services/wastePlant/pickupService");
const truckService_1 = require("../../services/wastePlant/truckService");
const userService_1 = require("../../services/wastePlant/userService");
const notificationService_3 = require("../../services/wastePlant/notificationService");
const subscriptionService_2 = require("../../services/wastePlant/subscriptionService");
const paymentService_3 = require("../../services/wastePlant/paymentService");
const dashboardService_2 = require("../../services/wastePlant/dashboardService");
const reportService_1 = require("../../services/wastePlant/reportService");
const profileService_2 = require("../../services/wastePlant/profileService");
const walletService_3 = require("../../services/wastePlant/walletService");
const authService_4 = require("../../services/driver/authService");
const chatService_2 = require("../../services/driver/chatService");
const profileService_3 = require("../../services/driver/profileService");
const pickupService_3 = require("../../services/driver/pickupService");
const truckService_2 = require("../../services/driver/truckService");
const mapService_1 = require("../../services/driver/mapService");
const notificationService_4 = require("../../services/driver/notificationService");
const dashboardService_3 = require("../../services/driver/dashboardService");
const walletService_4 = require("../../services/driver/walletService");
//-- Repositories & their interfaces --
const superAdminRepository_1 = require("../../repositories/superAdmin/superAdminRepository");
const userRepository_1 = require("../../repositories/user/userRepository");
const otpRepository_1 = require("../../repositories/otp/otpRepository");
const pickupRepository_1 = require("../../repositories/pickupReq/pickupRepository");
const dropSpotRepository_1 = require("../../repositories/dropSpot/dropSpotRepository");
const wastePlantRepository_1 = require("../../repositories/wastePlant/wastePlantRepository");
const truckRepository_1 = require("../../repositories/truck/truckRepository");
const driverRepository_1 = require("../../repositories/driver/driverRepository");
const chatMsgRepository_1 = require("../../repositories/chat/chatMsgRepository");
const conversationRepository_1 = require("../../repositories/chat/conversationRepository");
const notificationRepository_1 = require("../../repositories/notification/notificationRepository");
const wasteCollectionRepository_1 = require("../../repositories/wasteCollection/wasteCollectionRepository");
const subscriptionPlanRepository_1 = require("../../repositories/subscriptionPlan/subscriptionPlanRepository");
const subscriptionPaymentRepository_1 = require("../../repositories/subscriptionPayment/subscriptionPaymentRepository");
const walletRepository_1 = require("../../repositories/wallet/walletRepository");
const ratingRepository_1 = require("../../repositories/rating/ratingRepository");
const attendanceRepository_1 = require("../../repositories/atendance/attendanceRepository");
//Create the container
const container = new inversify_1.Container();
//--Bind Controllers--
//superadmin
container
    .bind(types_1.default.SuperAdminAuthController)
    .to(authController_1.AuthController);
container
    .bind(types_1.default.SuperAdminPlantController)
    .to(wastePlantController_1.WastePlantController);
container
    .bind(types_1.default.SuperAdminDashboardController)
    .to(dashboardController_1.DashboardController);
container
    .bind(types_1.default.SuperAdminNotificationController)
    .to(notificationController_1.NotificationController);
container
    .bind(types_1.default.SuperAdminSubscriptionController)
    .to(subscriptionController_1.SubscriptionController);
container
    .bind(types_1.default.SuperAdminPaymentController)
    .to(paymentController_1.PaymentController);
container
    .bind(types_1.default.SuperAdminWalletController)
    .to(walletController_1.WalletController);
//user
container.bind(types_1.default.UserAuthController).to(userController_1.UserController);
container
    .bind(types_1.default.UserProfileController)
    .to(profileController_1.ProfileController);
container
    .bind(types_1.default.ResidentialController)
    .to(residentialController_1.ResidentialController);
container
    .bind(types_1.default.CommercialController)
    .to(commercialController_1.CommercialController);
container
    .bind(types_1.default.UserPickupController)
    .to(pickupController_1.PickupController);
container
    .bind(types_1.default.UserPaymentController)
    .to(paymentController_2.PaymentController);
container
    .bind(types_1.default.UserDropSpotController)
    .to(dropSpotController_1.DropSpotController);
container
    .bind(types_1.default.UserNotificationController)
    .to(notificationController_2.NotificationController);
container
    .bind(types_1.default.UserWalletController)
    .to(walletController_2.WalletController);
container
    .bind(types_1.default.UserRatingController)
    .to(ratingController_1.RatingController);
//wasteplant
container
    .bind(types_1.default.PlantAuthController)
    .to(authController_2.AuthController);
container
    .bind(types_1.default.PlantChatController)
    .to(chatController_1.ChatController);
container
    .bind(types_1.default.PlantDriverController)
    .to(driverController_1.DriverController);
container
    .bind(types_1.default.PlantDropSpotController)
    .to(dropSpotController_2.DropSpotController);
container
    .bind(types_1.default.PlantPickupController)
    .to(pickupController_2.PickupController);
container
    .bind(types_1.default.PlantTruckController)
    .to(truckController_1.TruckController);
container
    .bind(types_1.default.PlantUserController)
    .to(userController_2.UserController);
container
    .bind(types_1.default.PlantNotificationController)
    .to(notificationController_3.NotificationController);
container
    .bind(types_1.default.PlantSubscriptionController)
    .to(subscriptionController_2.SubscriptionController);
container
    .bind(types_1.default.PlantPaymentController)
    .to(paymentController_3.PaymentController);
container
    .bind(types_1.default.PlantDashboardController)
    .to(dashboardController_2.DashboardController);
container
    .bind(types_1.default.PlantReportController)
    .to(reportController_1.ReportController);
container
    .bind(types_1.default.PlantProfileController)
    .to(profileController_2.ProfileController);
container
    .bind(types_1.default.PlantWalletController)
    .to(walletController_3.WalletController);
//driver
container
    .bind(types_1.default.DriverAuthController)
    .to(authController_3.AuthController);
container
    .bind(types_1.default.DriverChatController)
    .to(chatController_2.ChatController);
container
    .bind(types_1.default.DriverProfileController)
    .to(profileController_3.ProfileController);
container
    .bind(types_1.default.DriverPickupController)
    .to(pickupController_3.PickupController);
container
    .bind(types_1.default.DriverTruckController)
    .to(truckController_2.TruckController);
container
    .bind(types_1.default.DriverMapController)
    .to(mapController_1.MapController);
container
    .bind(types_1.default.DriverNotificationController)
    .to(notificationController_4.NotificationController);
container
    .bind(types_1.default.DriverDashboardController)
    .to(dashboardController_3.DashboardController);
container
    .bind(types_1.default.DriverWalletController)
    .to(walletController_4.WalletController);
//--Bind Services--
//superadmin
container
    .bind(types_1.default.SuperAdminAuthService)
    .to(authService_1.SuperAdminAuthService);
container
    .bind(types_1.default.SuperAdminPlantService)
    .to(wastePlantService_1.WastePlantService);
container
    .bind(types_1.default.SuperAdminDashboardService)
    .to(dashboardService_1.DashboardService);
container
    .bind(types_1.default.SuperAdminNotificationService)
    .to(notificationService_1.NotificationService);
container
    .bind(types_1.default.SuperAdminSubscriptionService)
    .to(subscriptionService_1.SubscriptionService);
container
    .bind(types_1.default.SuperAdminPaymentService)
    .to(paymentService_1.PaymentService);
container
    .bind(types_1.default.SuperAdminWalletService)
    .to(walletService_1.WalletService);
//user
container.bind(types_1.default.UserAuthService).to(authService_2.AuthService);
container
    .bind(types_1.default.UserProfileService)
    .to(profileService_1.ProfileService);
container
    .bind(types_1.default.ResidentialService)
    .to(residentialService_1.ResidentialService);
container
    .bind(types_1.default.CommercialService)
    .to(commercialService_1.CommercialService);
container
    .bind(types_1.default.UserPickupService)
    .to(pickupService_1.PickupService);
container
    .bind(types_1.default.UserPaymentService)
    .to(paymentService_2.PaymentService);
container
    .bind(types_1.default.UserDropSpotService)
    .to(dropSpotService_1.DropSpotService);
container
    .bind(types_1.default.UserNotificationService)
    .to(notificationService_2.NotificationService);
container
    .bind(types_1.default.UserWalletService)
    .to(walletService_2.WalletService);
container
    .bind(types_1.default.UserRatingService)
    .to(ratingService_1.RatingService);
//wasteplant
container.bind(types_1.default.PlantAuthService).to(authService_3.AuthService);
container.bind(types_1.default.PlantChatService).to(chatService_1.ChatService);
container
    .bind(types_1.default.PlantDriverService)
    .to(driverService_1.DriverService);
container
    .bind(types_1.default.PlantDropSpotService)
    .to(dropSpotService_2.DropSpotService);
container
    .bind(types_1.default.PlantPickupService)
    .to(pickupService_2.PickupService);
container
    .bind(types_1.default.PlantTruckService)
    .to(truckService_1.TruckService);
container.bind(types_1.default.PlantUserService).to(userService_1.UserService);
container
    .bind(types_1.default.PlantNotificationService)
    .to(notificationService_3.NotificationService);
container
    .bind(types_1.default.PlantSubscriptionService)
    .to(subscriptionService_2.SubscriptionService);
container
    .bind(types_1.default.PlantPaymentService)
    .to(paymentService_3.PaymentService);
container
    .bind(types_1.default.PlantDashboardService)
    .to(dashboardService_2.DashboardService);
container
    .bind(types_1.default.PlantReportService)
    .to(reportService_1.ReportService);
container
    .bind(types_1.default.PlantProfileService)
    .to(profileService_2.ProfileService);
container
    .bind(types_1.default.PlantWalletService)
    .to(walletService_3.WalletService);
//driver
container
    .bind(types_1.default.DriverAuthService)
    .to(authService_4.AuthService);
container
    .bind(types_1.default.DriverChatService)
    .to(chatService_2.ChatService);
container
    .bind(types_1.default.DriverProfileService)
    .to(profileService_3.ProfileService);
container
    .bind(types_1.default.DriverPickupService)
    .to(pickupService_3.PickupService);
container
    .bind(types_1.default.DriverTruckService)
    .to(truckService_2.TruckService);
container.bind(types_1.default.DriverMapService).to(mapService_1.MapService);
container
    .bind(types_1.default.DriverNotificationService)
    .to(notificationService_4.NotificationService);
container
    .bind(types_1.default.DriverDashboardService)
    .to(dashboardService_3.DashboardService);
container
    .bind(types_1.default.DriverWalletService)
    .to(walletService_4.WalletService);
//--Bind Repositories--
container
    .bind(types_1.default.SuperAdminRepository)
    .to(superAdminRepository_1.SuperAdminRepository);
container.bind(types_1.default.UserRepository).to(userRepository_1.UserRepository);
container.bind(types_1.default.OtpRepository).to(otpRepository_1.OtpRepository);
container.bind(types_1.default.PickupRepository).to(pickupRepository_1.PickupRepository);
container
    .bind(types_1.default.DropSpotRepository)
    .to(dropSpotRepository_1.DropSpotRepository);
container
    .bind(types_1.default.WastePlantRepository)
    .to(wastePlantRepository_1.WastePlantRepository);
container
    .bind(types_1.default.ChatMsgRepository)
    .to(chatMsgRepository_1.ChatMsgRepository);
container
    .bind(types_1.default.ConversationRepository)
    .to(conversationRepository_1.ConversationRepository);
container
    .bind(types_1.default.TruckRepository)
    .to(truckRepository_1.TruckRepository)
    .inSingletonScope();
container
    .bind(types_1.default.DriverRepository)
    .to(driverRepository_1.DriverRepository)
    .inSingletonScope();
container
    .bind(types_1.default.NotificationRepository)
    .to(notificationRepository_1.NotificationRepository);
container
    .bind(types_1.default.WasteCollectionRepository)
    .to(wasteCollectionRepository_1.WasteCollectionRepository);
container
    .bind(types_1.default.SubscriptionPlanRepository)
    .to(subscriptionPlanRepository_1.SubscriptionPlanRepository);
container
    .bind(types_1.default.SubscriptionPaymentRepository)
    .to(subscriptionPaymentRepository_1.SubscriptionPaymentRepository);
container
    .bind(types_1.default.WalletRepository)
    .to(walletRepository_1.WalletRepository);
container
    .bind(types_1.default.RatingRepository)
    .to(ratingRepository_1.RatingRepository);
container
    .bind(types_1.default.AttendanceRepository)
    .to(attendanceRepository_1.AttendanceRepository);
// Bind factory for circular dep
container
    .bind(types_1.default.DriverRepositoryFactory)
    .toFactory(() => {
    return () => container.get(types_1.default.DriverRepository);
});
container
    .bind(types_1.default.TruckRepositoryFactory)
    .toFactory(() => {
    return () => container.get(types_1.default.TruckRepository);
});
exports.default = container;
