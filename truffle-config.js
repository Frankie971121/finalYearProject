const ContractKit = require('@celo/contractkit')
const Web3 = require('web3')
const path = require('path')

// Connect to the desired network
const web3 = new Web3('https://alfajores-forno.celo-testnet.org')
const kit = ContractKit.newKitFromWeb3(web3)
// const kit = Kit.newKit('https://forno.celo.org') // mainnet endpoint

const getAccount = require('./utils/getAccount').getAccount

async function awaitWrapper(){
    let account = await getAccount()
    console.log(`Account address: ${account}`)
    kit.addAccount(account.privateKey)
}

awaitWrapper()

module.exports = {

  contracts_build_directory: path.join(__dirname, "client/contracts"),

  networks: {
    development: {
     host: "127.0.0.1",
     port: 8545,
     network_id: "1234",
    },
    alfajores: {
      provider: kit.web3.currentProvider,
      network_id: 44787
    },
    mainnet: {
      provider: kit.web3.currentProvider,
      network_id: 42220
    }
  }
};
