export const supportedChains = {
    "0x89": {
      name: "Polygon Mainnet",
      short_name: "matic",
      chain: "MATIC",
      network: "polygon",
      network_id: 137,
      chain_id: "0x89",
      providers: ["walletconnect"],
      // , 'portis', 'fortmatic'
      rpc_url: `https://polygon-rpc.com`,
      block_explorer: "https://polygonscan.com/",
    },
    "0x13881": {
      name: "Polygon Mumbai Testnet",
      short_name: "matic",
      chain: "MUMBAI",
      network: "mumbai",
      network_id: 80001,
      chain_id: "0x13881",
      providers: ["walletconnect"],
      // , 'portis', 'fortmatic'
      rpc_url: `https://rpc-mumbai.maticvigil.com`,
      block_explorer: "https://polygonscan.com/",
    },
  };
  
  export const chainByID = (chainID) => {
    return supportedChains[chainID];
  };
  
  export const chainByNetworkId = (networkId) => {
    const idMapping = {
      137: supportedChains["0x89"],
      80001: supportedChains["0x13881"],
    };
  
    return idMapping[networkId];
  };
  