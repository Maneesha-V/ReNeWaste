import { Types } from "mongoose";

export interface IPayment {
  status: 'Pending' | 'Paid' | 'Failed';
  method: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  amount: number;
  paidAt: Date | null;
}
 export interface IPaymentDocument extends IPayment, Document {
      _id: Types.ObjectId;
    }