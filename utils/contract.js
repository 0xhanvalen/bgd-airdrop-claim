import { MATIC_ADDRESS, MUMBAI_ADDRESS, MUMBAI_COIN_ADDRESS, MATIC_COIN_ADDRESS } from "./address";
import { ABI } from "./abi";
import { chainByID } from "./chain";
import { ethers } from "ethers";


export const Contract = (chainID, provider, signer, isCoin) => {
  let contractAddress;

  if (chainID == "0x89" && !isCoin) {
    contractAddress = MATIC_ADDRESS;
  }

  if (chainID == "0x13881" && !isCoin) {
    contractAddress = MUMBAI_ADDRESS;
  }

  if (chainID == "0x89" && isCoin) {
    contractAddress = MATIC_COIN_ADDRESS;
  }


  if (chainID == "0x13881" && isCoin) {
    contractAddress = MUMBAI_COIN_ADDRESS;
  }

  if (typeof contractAddress == "undefined") {
    alert("You must change your chain");
    return null;
  }

  const read = new ethers.Contract(contractAddress, ABI, provider);
  const write = new ethers.Contract(contractAddress, ABI, signer);
  return { read, write };
};
