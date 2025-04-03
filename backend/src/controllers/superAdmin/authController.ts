import { Request, Response } from "express";
import SuperAdminAuthService from "../../services/superAdmin/authService"
import { IAuthController } from "./interface/IAuthController";

class AuthController implements IAuthController {
async superAdminLogin (req: Request, res: Response):Promise<void> {
  try {
    const { email, password } = req.body
    const { admin, token } = await SuperAdminAuthService.adminLoginService({email, password});
    res.status(200).json({ admin, token });
  } catch (error: any) {
    console.error("err",error)
    res.status(400).json({ error: error.message });
  }
}
}
export default new AuthController();