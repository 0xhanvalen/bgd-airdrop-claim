import { useState, useEffect, useContext, createContext, useRef } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { supportedChains } from "../utils/chain.js";
import {
  deriveChainId,
  deriveSelectedAddress,
  getProviderOptions,
} from "../utils/web3modal.js";
import { Contract } from "../utils/contract";

export const EthersContext = createContext(null);

export const EthersContextFC = ({ children }) => {
  const [address, setAddress] = useState(null);
  const [web3Modal, setWeb3Modal] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const connectProvider = async () => {
    setIsUpdating(true);
    const providerOptions = getProviderOptions();

    const web3modal = new Web3Modal({
      providerOptions,
    });

    const instance = await web3modal.connect();
    const tempProvider = new ethers.providers.Web3Provider(instance);
    const tempSigner = tempProvider.getSigner();
    const tempAddress = await tempSigner.getAddress();
    setProvider(tempProvider);
    setSigner(tempSigner);
    setAddress(tempAddress);
  };

  const disconnect = async () => {
    setIsUpdating(true);
    setProvider(null);
    setSigner(null);
    setAddress(null);
  }

  return (
    <EthersContext.Provider
      value={{ connectProvider, isUpdating, provider, signer, address, disconnect }}
    >
      {children}
    </EthersContext.Provider>
  );
};

export const useEthers = () => {
  const { isUpdating, provider, signer, address, connectProvider, disconnect } =
    useContext(EthersContext);
  return { isUpdating, provider, signer, address, connectProvider, disconnect };
};
