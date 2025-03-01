import { Alchemy, Network } from "alchemy-sdk";

export default async () => {
  const config = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.MATIC_AMOY,
  };
  const alchemy = new Alchemy(config);
  alchemy.ws.on(
    {
      address: process.env.CONTRACT_ADDRESS,
    },
    (tx: any) => {
      console.log(tx.address);
    }
  );
};
