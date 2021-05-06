## Requirements

- [Node.js](https://nodejs.org/en/)
- [Yarn package manager](https://yarnpkg.com/)
- [Truffle](https://www.trufflesuite.com/truffle)
- [Expo](https://docs.expo.io/get-started/installation/)

```bash
yarn       # install depenedncies
cd client  # move into the client directory
yarn       # install front end dependencies
```

This project uses React Native and [Expo](https://expo.io/) for developing a mobile first Celo blockchain experience. 

## Mobile Dependencies

You will need the Expo app installed on your development mobile device or emulator ([iOS](https://apps.apple.com/app/apple-store/id982107779) or [Android](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www)). 

You will also need the [Celo Wallet](https://celo.org/developers/wallet) on your mobile device (or emulator) to sign transactions. The app may automatically connect to a HelloWorld contract that has already been deployed to the testnet, or you may have to deploy your own (details below).

## Smart contract development

The box is configured to deploy Solidity smart contracts to the Alfajores test network. You will need test network funds to deploy your own contract. 

To create a new account for development, in the project root run

```bash
yarn account
```

The new account address will be printed in the console. This script will generate a private key for you and store it in `/.secret`. If you need to print the account info again, run `yarn account` again. It will not create a new account, it will read the saved private key and print the corresponding account address. 

Truffle will read this private key for contract deployments. 

Copy your account address and paste it in to the [Alfajores faucet](https://celo.org/developers/faucet) to fund your account.

You can migrate and deploy the parent `SmartRentFactory.sol` contract to the alfajores test network with

```bash
truffle migrate --network alfajores OR
truffle migrate --network alfajores --reset
```

Since we are developing this on the public Alfajores test network, we can view all the accounts, contracts and transactions on the [public Alfajores block explorer](https://alfajores-blockscout.celo-testnet.org/).

You can look up the contract deployment transaction on the Alfajores block explorer via the transaction hash.

Truffle will save the deployment information to the Truffle artifact located at `client/contracts/SmartRentFactory.json`. You will use this deployment information to connect your React Native application to the correct contract.

## Developing the mobile application

Keep in mind that you will need a version of the Celo Wallet installed on the mobile device with which you are developing the application. The Celo Wallet is the private key management software that the user will sign transactions with. 

You can install the Celo wallet on your physical device with an invite code [here.](https://celo.org/developers/wallet) 

You can build a the latest version of the Celo Wallet and find instructions on running a development build [here.](https://github.com/celo-org/celo-monorepo/tree/master/packages/mobile) 

Once you have a device with the Celo wallet installed, you can start working on your application. 

For the purposes of introduction, we have added some code to you get you started located in App.js in the `client` directory.

### Application development with Expo

In this project, the React Native application lives in the `client` directory. `cd` into the client directory and run `$ yarn` to install the dependencies. 

[Expo](https://expo.io/) is a tool that makes developing React Native applications much easier. We will be using Expo for easy setup.

Install it with:
```
yarn global add expo-cli
# or
npm install --global expo-cli
```

You can start the application from the client directory with
```
expo start
```

You can use your physical mobile device or an emulator to develop apps with Expo. If you want to use your physical device, you will have to [install the Expo app on your device.](https://expo.io/learn)

Make sure the Celo Wallet app is open on your device when you are using your dapp. Your dapp will be requesting information from the Celo Wallet.

### Using an emulator

You can find more information about running and Android emulator [here.](https://developer.android.com/studio/run/emulator-commandline)

If you're using Anroid Studio and might face issue when installing Alfajores Celo Wallet apk to emulator, try to use an emulator with google play service and download the wallet through google play store.

### Wrapping Up

```bash
- yarn
- cd client
- yarn
- cd..
- yarn account # create a random account to deploy parent contract
- truffle compile # if changes were made on contract file
- truffle migrate --network alfajores --reset
- cd client
- expo start
```