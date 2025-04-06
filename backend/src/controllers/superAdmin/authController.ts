import { Request, Response } from "express";
import SuperAdminAuthService from "../../services/superAdmin/authService";
import { IAuthController } from "./interface/IAuthController";

class AuthController implements IAuthController {
  async superAdminLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { admin, token } = await SuperAdminAuthService.adminLoginService({
        email,
        password,
      });
      res.status(200).json({ admin, token });
    } catch (error: any) {
      console.error("err", error);
      res.status(400).json({ error: error.message });
    }
  }
  async superAdminSignup(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body);
      
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        res.status(400).json({ error: "All fields are required." });
        return;
      }
      const { admin, token } = await SuperAdminAuthService.adminSignupService({
        username,
        email,
        password,
      });
      res.status(200).json({ admin, token });
    } catch (error: any) {
      console.error("err", error);
      res.status(400).json({ error: error.message });
    }
  }
  async superAdminLogout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.status(200).json({ message: "Logout successful" });
    } catch (error: any) {
      res.status(500).json({ error: "Logout failed. Please try again." });
    }
  }
}
export default new AuthController();
