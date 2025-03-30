import { Request, Response } from "express";
import { adminLoginService } from "../../services/superAdmin/authService";

export const superAdminLogin = async (req: Request, res: Response):Promise<void> => {
  try {
    console.log("body",req.body);
    const { email, password } = req.body
    const { admin, token } = await adminLoginService({email, password});
    console.log("resp",admin,token);
    
    res.status(200).json({ admin, token });
  } catch (error: any) {
    console.error("err",error)
    res.status(400).json({ error: error.message });
  }
}