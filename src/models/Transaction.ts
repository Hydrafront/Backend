import { model, Schema } from "mongoose";

export type TTransaction = {
  type: "Buy" | "Sell";
  chainId: number;
  price: number;
  usd: number;
  eth: number;
  token: number;
  txHash: string;
  tokenAddress: string;
  maker: string;
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
    tokenAddress: {
      type: String,
      required: true,
    },
    maker: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    usd: {
      type: Number,
      required: true,
    },
    eth: {
      type: Number,
      required: true,
    },
    token: {
      type: Number,
      required: true,
    },
    txHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Transaction = model<ITransaction>("Transaction", transactionSchema);

export default Transaction;
