import { model, Schema } from "mongoose";

export type TTrader = {
  address: string;
  transactions: string[];
};

export interface ITrader extends TTrader, Document {}

const traderSchema: Schema = new Schema({
  address: {
    type: String,
    required: true,
  },
  transactions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    },
  ],
});

const Trader = model<ITrader>("Trader", traderSchema);

export default Trader;
