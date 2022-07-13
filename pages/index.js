import { useState, useEffect } from "react";
import { useEthers } from "../contexts/EthersProviderContext";
import { Contract } from "../utils/contract";
import toast from "react-hot-toast";
import {ethers} from 'ethers';


export default function Home() {
  const { isUpdating, provider, signer, address, connectProvider, disconnect } =
    useEthers();
  const [contract, setContract] = useState();
  const [coinContract, setCoinContract] = useState();
  const [truncAddress, setTruncAddress] = useState();
  const [isValidClaimant, setIsValidClaimant] = useState();
  const [proof, setProof] = useState();
  const [entry, setEntry] = useState();
  const [isClaimed, setIsClaimed] = useState();

  async function getContract() {
    let network = await provider.getNetwork();
    let tempContract = Contract(network.chainId, provider, signer, false);
    setContract(tempContract);
  }
  
  async function getCoinContract() {
    let network = await provider.getNetwork();
    let tempContract = Contract(network.chainId, provider, signer, true);
    setCoinContract(tempContract);
  }

  async function checkAddress() {
    const stringedAddy = JSON.stringify({ address });
    const req = { method: "POST", body: stringedAddy };
    const res = await (await fetch("/api/merkle", req)).json();
    setProof(res?.proof);
    setEntry(res?.entry);
    console.log({entry: res?.entry});
    setIsValidClaimant(res?.isValidAddress);
  }

  useEffect(() => {
    if (address && provider && signer) {
      getContract();
      getCoinContract();
    }
  }, [address, provider, signer]);

  const getCoinClaimed = async () => {
    const val = await coinContract?.read?.isClaimed();
  }

  // useEffect(() => {
  //   if (coinContract?.read) {
  //   }
  // },[coinContract]);

  useEffect(() => {
    setTruncAddress(
      `${address?.substr(0, 6)}...${address?.substr(
        address.length - 4,
        address.length
      )}`
    );
    checkAddress();
  }, [address]);

  const claimTokens = async () => {
    toast("Attempting Claim...");
    const amt = ethers.BigNumber.from(entry?.balance);
    try {
      const tx = await contract?.write?.claimTokens(
        address,
        amt,
        proof
      );
      const receipt = await tx.wait();
      if (receipt?.status === 1) {
        // success!
        toast.success("Claim success.");
        setIsClaimed(true);
      }
    } catch (error) {
      toast.error("Claim failed.");
      console.error(error);
    }
  };

  return (
    <>
      <div
        style={{
          backgroundColor: `#000000`,
          display: `flex`,
          flexDirection: `column`,
        }}
      >
        <img
          src="/fuzzy.svg"
          alt=""
          style={{
            position: `absolute`,
            right: `0px`,
            top: `0px`,
            transform: `translateX(50%) translateY(-50%)`,
            zIndex: `1`,
            maxWidth: `100vw`,
          }}
        />
        <img
          src="/4.png"
          alt="Big Green DAO"
          style={{ maxWidth: `400px`, margin: `1rem auto`, zIndex: `2` }}
        />
        {!address && (
          <div
            style={{
              backgroundColor: `white`,
              width: `fit-content`,
              padding: `1rem`,
              zIndex: `2`,
            }}
            className={"divbutton"}
            onClick={() => connectProvider()}
          >
            Connect Wallet
          </div>
        )}
        {address && (
          <div
            style={{
              backgroundColor: `white`,
              width: `fit-content`,
              padding: `1rem`,
              position: `absolute`,
              right: `0`,
              top: `0`,
              transform: `translateX(-25%) translateY(25%)`,
              zIndex: `2`,
            }}
            className={"divbutton"}
            onClick={() => disconnect()}
          >
            {truncAddress}
          </div>
        )}

        {address && isValidClaimant && (
          <div
            style={{
              backgroundColor: `white`,
              width: `fit-content`,
              padding: `1rem`,
              zIndex: `2`,
              margin: `0 auto`,
            }}
            className={"divbutton"}
            onClick={() => claimTokens()}
          >
            Claim $GARDEN Tokens
          </div>
        )}
      </div>
    </>
  );
}
