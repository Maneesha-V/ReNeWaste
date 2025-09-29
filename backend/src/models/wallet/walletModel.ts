import { model } from "mongoose";
import { IWalletDocument } from "./interfaces/walletInterface";
import { walletSchema } from "./walletSchema";

export const WalletModel = model<IWalletDocument>("Wallet", walletSchema )