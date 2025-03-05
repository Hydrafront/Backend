import { Alchemy, Network } from "alchemy-sdk";

const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.MATIC_AMOY,
};
export const alchemy = new Alchemy(config);

export default async () => {
  const data = await alchemy.core.getTokenBalances("0x3A2717e647D475E1c65C6156bcBeCf24BeF76Af4")
  console.log(data.tokenBalances)
  alchemy.ws.on(
    {
      address: process.env.CONTRACT_ADDRESS,
    },
    (tx: any) => {
      console.log(tx.address);
    }
  );
};
