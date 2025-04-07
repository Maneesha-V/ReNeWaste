import { Request, Response } from "express";
import { IAuthController } from "./interface/IAuthController";
import AuthService from "../../services/driver/authService";

class AuthController implements IAuthController {
  async driverLogin(req: Request, res: Response): Promise<void> {
    try {
      console.log("body", req.body);
      const { email, password } = req.body;
      const { driver, token } = await AuthService.loginDriver({
        email,
        password,
      });
      console.log("driver",driver);
      console.log("token",token);
      res.status(200).json({ driver, token });
    } catch (error: any) {
      console.error("err", error);
      res.status(400).json({ error: error.message });
    }
  }
}
export default new AuthController();