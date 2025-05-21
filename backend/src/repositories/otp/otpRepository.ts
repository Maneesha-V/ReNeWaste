import { injectable } from "inversify";
import { IOtpDocument } from "../../models/user/interfaces/otpInterface";
import { OTPModel } from "../../models/user/otpModel";
import { OtpRecord } from "../../types/user/authTypes";
import BaseRepository from "../baseRepository/baseRepository";
import { IOtpRepository } from "./interface/IOtpRepository";


@injectable()
export class OtpRepository extends BaseRepository<IOtpDocument> implements IOtpRepository {
  constructor() {
    super(OTPModel);
  }

  async saveOtp(email: string, otp: string): Promise<void> {
    await this.model.create({ email, otp, createdAt: new Date() });
  }

  async reSaveOtp(email: string, otp: string): Promise<void> {
    await this.model.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { new: true, upsert: true }
    );
  }

  async findOtpByEmail(email: string): Promise<OtpRecord | null> {
    return await this.model.findOne({ email });
  }

  async deleteOtp(email: string): Promise<void> {
    await this.model.deleteOne({ email });
  }
}
