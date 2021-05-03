// Initialize an instance of ContractKit connected to the Alfajores testnet (read-only)

import Web3 from 'web3'
import { newKitFromWeb3 } from "@celo/contractkit";

// const HDWalletProvider = require("@truffle/hdwallet-provider");
// const mnemonicPhrase = "unaware arrange spring another wild disagree focus summer lady ship remember foil fruit box entire tiger earth apple arrest chest nose glass spawn course";

// export const provider = new HDWalletProvider({
//     mnemonic: mnemonicPhrase,
//     derivationPath: "m/44'/52752'/0'/0/0",
//     shareNonce: true,
//     providerOrUrl: "https://alfajores-forno.celo-testnet.org"
// });
export const provider = "https://alfajores-forno.celo-testnet.org"
// export const provider = 'https://forno.celo.org' // or 'wss://forno.celo.org/ws' (for websocket support)

export const web3 = new Web3(provider);
export const kit = newKitFromWeb3(web3)
