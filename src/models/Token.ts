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
  initialBuy: number;
  boost: number;
  progress: number;
  marketCap: number;
  price: number;
  volume: number;
  makerCount: number;
  _5M: number;
  _1H: number;
  _6H: number;
  _24H: number;
  holders: string[];
  transactionCount: number;
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
    initialBuy: {
      type: Number,
      default: 0,
    },
    boost: {
      type: Number,
      default: 0,
    },
    progress: {
      type: Number,
      required: true,
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
    holders: [String],
    transactionCount: {
      type: Number,
      default: 0,
    },
    makerCount: {
      type: Number,
      default: 0,
    },
    _5M: {
      type: Number,
      default: 0,
    },
    _1H: {
      type: Number,
      default: 0,
    },
    _6H: {
      type: Number,
      default: 0,
    },
    _24H: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Token = model<IToken>("Token", tokenSchema);

export default Token;
