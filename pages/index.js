import { useState, useEffect } from "react";
import { useEthers } from "../contexts/EthersProviderContext";
import { Contract } from "../utils/contract";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import { MATIC_ADDRESS, MUMBAI_ADDRESS, MUMBAI_COIN_ADDRESS, MATIC_COIN_ADDRESS } from "../utils/address";

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
    console.log({ entry: res?.entry });
    setIsValidClaimant(res?.isValidAddress);
  }

  useEffect(() => {
    if (address && provider && signer) {
      getContract();
    }
  }, [address, provider, signer]);

  const getCoinClaimed = async () => {
    const filter = await contract?.read?.filters.Claim(
      address
    );
    console.log({ filter });
    try {
      const events = await contract?.read?.queryFilter(filter, 
        27142288);
      console.log({ events });
    } catch (error) {
      console.error(error);
      if (error.code === -32603) {
        // do nothing, this indicates there is no event
      }
    }
  };

  useEffect(() => {
    if (contract?.read) {
      getCoinClaimed();
    }
  }, [contract]);

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
      const tx = await contract?.write?.claimTokens(address, amt, proof);
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

  const AddCoin = async () => {
    if (window?.ethereum) {
      let network = await provider.getNetwork();
      const tokenSymbol = "GRDN";
      const tokenDecimals = 2;
      const tokenImage = "https://bgd-airdrop-claim.vercel.app/7.png";
      let tokenAddress;
      if (network.chainId == "0x89") {
        tokenAddress = MATIC_COIN_ADDRESS;
      }
      if (network.chainId == "0x13881") {
        tokenAddress = MUMBAI_COIN_ADDRESS;
      }
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage, // A string url of the token logo
          },
        },
      })
      if (wasAdded) {
        toast.success("Coin Added");
      }
    }
  }

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
              margin: `0 auto`,
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
        {address && (
          <div
            style={{
              backgroundColor: `white`,
              width: `fit-content`,
              padding: `1rem`,
              margin: `1rem auto`,
              zIndex: `2`,
            }}
            className={"divbutton"}
            onClick={() => AddCoin()}
          >
            Add $GARDEN to wallet
          </div>
        )}
      </div>
    </>
  );
}
