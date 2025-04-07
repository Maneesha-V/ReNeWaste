import DriverRepository from "../../repositories/driver/driverRepository";
import { LoginRequest, LoginResponse } from "../../types/driver/authTypes";
import { generateToken } from "../../utils/authUtils";
import { IAuthService } from "./interface/IAuthService";
import bcrypt from "bcrypt";

class AuthService implements IAuthService {
  async loginDriver({
    email,
    password,
  }: LoginRequest): Promise<LoginResponse> {
    const driver = await DriverRepository.findDriverByEmail(email);

    if (
      !driver ||
      !(await bcrypt.compare(password, driver.password || ""))
    ) {
      throw new Error("Invalid email or password.");
    }
    const token = generateToken(driver._id.toString());
    return { driver, token };
  }
}
export default new AuthService();