// get Signature when create a new token
import { getBytes, solidityPackedKeccak256, toUtf8Bytes, Wallet } from "ethers";

export async function generateSignature(
    name: string,
    symbol: string,
    nonce: string,
    factory: string,
    chainId: string,
    msgSender: string,
    privateKey: string
  ) {
    // 1. Create the packed message hash (matching Solidity keccak256)
    const messageHash = solidityPackedKeccak256(
      ["string", "string", "uint256", "address", "uint256", "address"],
      [name, symbol, nonce, factory, chainId, msgSender]
    );
    console.log("Message Hash:", messageHash);
  
    // 2. Convert the hash to bytes
    const messageHashBytes = getBytes(messageHash);
  
    // 3. Create the Ethereum signed message prefix
    const prefix = toUtf8Bytes("\x19Ethereum Signed Message:\n32");
  
    // 4. Concatenate prefix and message hash
    const prefixedMessage = new Uint8Array(
      prefix.length + messageHashBytes.length
    );
    prefixedMessage.set(prefix);
    prefixedMessage.set(messageHashBytes, prefix.length);
  
    // 5. Create the final hash that matches toEthSignedMessageHash
    const finalHash = solidityPackedKeccak256(["bytes"], [prefixedMessage]);
    console.log("Final Hash (matching toEthSignedMessageHash):", finalHash);
  
    // 6. Sign the message
    const signer = new Wallet(privateKey);
    const signature = await signer.signMessage(messageHashBytes);
  
    return {
      messageHash,
      finalHash,
      signature,
    };
  }