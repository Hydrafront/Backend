import { model, Schema } from "mongoose";

export type TToken = {
  type: string;
  chainId: number;
  dex: string;
  tokenAddress: string;
  name: string;
  symbol: string;
  description: string;
  logo: string;
  banner: string;
  website: string;
  telegram: string;
  twitter: string;
  discord: string;
  initialSupply: number;
  boost: number;
  progress: number;
  marketCap: number;
  price: number;
  volume: number;
  transactionCount: number;
  holders: string[];
};
export interface IToken extends TToken, Document {}

const tokenSchema: Schema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    tokenAddress: {
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
    name: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    logo: {
      type: String,
    },
    banner: {
      type: String,
    },
    decimals: {
      type: Number,
      default: 18,
    },
    website: {
      type: String,
    },
    telegram: {
      type: String,
    },
    twitter: {
      type: String,
    },
    discord: {
      type: String,
    },
    initialSupply: {
      type: Number,
      default: 0,
    },
    boost: {
      type: Number,
      default: 0,
    },
    progress: {
      type: Number,
      default: 0,
    },
    marketCap: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    volume: {
      type: Number,
      default: 0,
    },
    transactions: [
      {
        buyer: String,
        amount: Number,
        txHash: String,
        createdAt: String,
      },
    ],
    holders: [String],
  },
  { timestamps: true }
);

const Token = model<IToken>("Token", tokenSchema);

export default Token;
