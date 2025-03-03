import { model, Schema } from "mongoose";

export type TTransaction = {
  type: "buy" | "sell";
  chainId: number;
  dex: string;
  tokenAddress: string;
  maker: string;
  amount: number;
  txHash: string;
  signature: string;
};
export interface ITransaction extends TTransaction, Document {}

const transactionSchema: Schema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    chainId: {
      type: Number,
      required: true,
    },
    dex: {
      type: String,
      required: true,
    },
    tokenAddress: {
      type: String,
      required: true,
    },
    maker: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    txHash: {
      type: String,
      required: true,
    },
    signature: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Transaction = model<ITransaction>("Transaction", transactionSchema);

export default Transaction;
