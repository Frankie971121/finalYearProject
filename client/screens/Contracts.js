import React from 'react'
import { useState, useEffect } from 'react'
import '../global'
import { web3, kit } from '../root'
import { Pressable, Image, StyleSheet, Text, TextInput, Button, View, ActivityIndicator, Modal, StatusBar } from 'react-native'
import {
    requestTxSig,
    waitForSignedTxs,
    requestAccountAddress,
    waitForAccountAuth,
    FeeCurrency
} from '@celo/dappkit'
import { toTxResult } from "@celo/connect"
import * as Linking from 'expo-linking'
import SmartRentContract from '../contracts/SmartRent.json'
import { Overlay } from 'react-native-elements'
import DateTimePicker from '@react-native-community/datetimepicker'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { auth, db } from '../utils/FirebaseConfig';

const Contracts = () => {

    // Set the defaults for the state
    const [address, setAddress] = useState('Not logged in');
    const [phoneNumber, setPhoneNumber] = useState('Not logged in');
    const [cUSDBalance, setcUSDBalance] = useState('Not logged in');
    const [smartRentContract, setSmartRentContract] = useState({});
    const [contractName, setContractName] = useState('');
    const [textInput, setTextInput] = useState('');
    const [deploying, setDeploying] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);

    const [name, setName] = useState('');
    const [roomAddress, setRoomAddress] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [mode1, setMode1] = useState('date');
    const [show1, setShow1] = useState(false);
    const [mode2, setMode2] = useState('date');
    const [show2, setShow2] = useState(false);
    const [deposit, setDeposit] = useState(null);
    const [rent, setRent] = useState(null);
    const [tenantAddress, setTenantAddress] = useState(null);

    const startDateString = startDate.getDate() + '/' + startDate.getMonth() + '/' + startDate.getFullYear();
    const endDateString = endDate.getDate() + '/' + endDate.getMonth() + '/' + endDate.getFullYear();

    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        (async () => {
            await db.collection('users')
                .doc(auth.currentUser.uid)
                .get()
                .then(querySnapshot => {
                    setUser(querySnapshot.data());
                    setLoading(false);
                });
        })();
    }, []);

    if(loading) {
        return <ActivityIndicator />;
    }

    const contractWallet = web3.eth.accounts.privateKeyToAccount(user.privateKey);

    const deployContract = async () => {
        let account = contractWallet;
        kit.connection.addAccount(account.privateKey)

        let tx = await kit.connection.sendTransaction({
            from: account.address,
            data: SmartRentContract.bytecode
        });

        const receipt = await tx.waitReceipt();
        console.log(receipt);
        console.log(receipt.contractAddress);

        const networkId = await web3.eth.net.getId();
        //const presetAddress = '0xcC10A9f22b7Bc4624a4f7DdAaC3f955BBCFb5B2a';

        // Get the deployed SmartRent contract info for the appropriate network ID
        //const deployedNetwork = SmartRentContract.networks[networkId];

        // Create a new contract instance with the HelloWorld contract info
        const instance = new web3.eth.Contract(
            SmartRentContract.abi,
            receipt.contractAddress
        );

        // Save the contract instance
        setSmartRentContract(instance);
        
    }


    const login = async () => {
        // A string you can pass to DAppKit, that you can use to listen to the response for that request
        const requestId = 'login'

        // A string that will be displayed to the user, indicating the DApp requesting access/signature
        const dappName = 'Hello Celo'

        // The deeplink that the Celo Wallet will use to redirect the user back to the DApp with the appropriate payload.
        const callback = Linking.makeUrl('/my/path')

        // Ask the Celo Alfajores Wallet for user info
        requestAccountAddress({
            requestId,
            dappName,
            callback,
        })

        // Wait for the Celo Wallet response
        const dappkitResponse = await waitForAccountAuth(requestId)

        // Set the default account to the account returned from the wallet
        kit.defaultAccount = dappkitResponse.address

        // Get the stabel token contract
        const stableToken = await kit.contracts.getStableToken()

        // Get the user account balance (cUSD)
        const cUSDBalanceBig = await stableToken.balanceOf(kit.defaultAccount)

        // Convert from a big number to a string
        let cUSDBalance = cUSDBalanceBig.toString()

        // Update state
        setcUSDBalance(cUSDBalance);
        setAddress(dappkitResponse.address);
        setPhoneNumber(dappkitResponse.phoneNumber);
    }


    const read = async () => {
        // Read the name stored in the HelloWorld contract
        let name = await smartRentContract.methods.getName().call()

        // Update state
        setContractName(name);
    }

    console.log(tenantAddress)
    console.log(rent)

    const prepareContract = async () => {
        const requestId = 'assignTenant'
        const dappName = 'Smart Rental'
        const callback = Linking.makeUrl('/my/path')

        console.log('done')

        const txObject = await smartRentContract.methods.assignTenant(tenantAddress, rent, deposit)

        requestTxSig(
            kit,
            [
                {
                    from: address,
                    to: smartRentContract.options.address,
                    tx: txObject,
                    feeCurrency: FeeCurrency.cUSD
                }
            ],
            { requestId, dappName, callback }
        )

        console.log('done1')

        const dappkitResponse = await waitForSignedTxs(requestId)
        const tx = dappkitResponse.rawTxs[0]

        // Get the transaction result, once it has been included in the Celo blockchain
        let result = await toTxResult(kit.web3.eth.sendSignedTransaction(tx)).waitReceipt()

        console.log(`Smart Rent contract update transaction receipt: `, result)

        setModalVisible(false);
    }

    const showDatepicker1 = () => {
        showMode1('date');
    }

    const showDatepicker2 = () => {
        showMode2('date');
    }

    const showMode1 = (currentMode) => {
        setShow1(true);
        setMode1(currentMode);
    }

    const showMode2 = (currentMode) => {
        setShow2(true);
        setMode2(currentMode);
    }

    const onChangeStartDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow1(false);
        setStartDate(currentDate);
    }

    const onChangeEndDate = (event, selectedDate) => {
        const currentDate1 = selectedDate || date;
        setShow2(false);
        setEndDate(currentDate1);
    }

    const readBalance = async () => {
        // let account = '0xdd0008e9dc53b953550b4781e3f5249143baa575';
        // let goldtoken = await kit.contracts.getGoldToken()
        // let stabletoken = await kit.contracts.getStableToken()
        // let celoBalance = await goldtoken.balanceOf(account)
        // let cUSDBalance = await stabletoken.balanceOf(account)
        // console.log('Account address: ' + account)
        // console.log('Account celo balance: ' + celoBalance)
        // console.log('Account cUSD balance: ' + cUSDBalance)
        // let account = contractWallet
        // console.log(account)
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Image resizeMode='contain' source={require("../assets/white-wallet-rings.png")}></Image>
            <Text>Open up client/App.js to start working on your app!</Text>

            <Text style={styles.title}>Create New Contract</Text>
            <Button title="deploy" 
                onPress={deployContract} />
            <Button title="Interact" 
                onPress={() => setModalVisible(!modalVisible)} />
            <Button title="Assign" 
                onPress={prepareContract} />
            {deploying ? (
                <Overlay isVisible={true} overlayStyle={{width:150, alignItems: 'center'}}>
                    <Text>Creating...</Text>
                </Overlay>
                ) : null}

            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {setModalVisible(!modalVisible);}}
            >
                <View style={styles.contractModal}>
                    <Text style={styles.titleText}>Create New Contract</Text>

                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>Landlord's Name</Text>
                        <TextInput
                            style={styles.inputContainer}
                            label="name"
                            placeholder="Name"
                            onChangeText={(inputName) => {
                                setName(inputName);
                            }}
                        />

                        <Text style={styles.infoText}>Address of Rent Property</Text>
                        <TextInput
                            style={styles.inputContainer}
                            label="address"
                            placeholder="Address"
                            onChangeText={(inputAddress) => {
                                setRoomAddress(inputAddress);
                            }}
                        />

                        <Text style={styles.infoText}>Start Date</Text>
                        <Pressable style={styles.date} onPress={showDatepicker1}>
                            <Text style={styles.dateWidth}>{startDateString}</Text>                 
                            <Fontisto name="date" size={18} />
                        </Pressable>
                        {show1 && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={startDate}
                                mode={mode1}
                                is24Hour={true}
                                display="default"
                                onChange={onChangeStartDate}
                            />
                        )}

                        <Text style={styles.infoText}>End Date</Text>
                        <Pressable style={styles.date} onPress={showDatepicker2}>
                            <Text style={styles.dateWidth}>{endDateString}</Text>
                            <Fontisto name="date" size={20} />
                        </Pressable>
                        {show2 && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={endDate}
                                mode={mode2}
                                is24Hour={true}
                                display="default"
                                onChange={onChangeEndDate}
                            />
                        )}

                        <Text style={styles.infoText}>Security Deposit</Text>
                        <TextInput
                            style={styles.inputContainer}
                            label="Deposit"
                            placeholder="Deposit"
                            onChangeText={(inputDeposit) => {
                                setDeposit(inputDeposit);
                            }}
                        />

                        <Text style={styles.infoText}>Monthly Rent</Text>
                        <TextInput
                            style={styles.inputContainer}
                            label="Rent"
                            placeholder="Monthly Rent"
                            onChangeText={(inputRent) => {
                                setRent(inputRent);
                            }}
                        />

                        <Text style={styles.infoText}>Tenant Address</Text>
                        <TextInput
                            style={styles.inputContainer1}
                            label="publicAddress"
                            numberOfLines={2}
                            placeholder="e.g. 0x233DFF35AC2F2da9B38eA82f9c7C2693dDa9Ef9B"
                            onChangeText={(inputTenantAddress) => {
                                setTenantAddress(inputTenantAddress);
                            }}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button
                            type="outline"
                            title="Submit"
                            onPress={() => setModalVisible(!modalVisible)}
                        />
                    </View>
                </View>
            </Modal>
            
            <Text style={styles.title}>Login first</Text>
            <Button title="login()" 
                onPress={login} />
                    <Text style={styles.title}>Account Info:</Text>
            <Text>Current Account Address:</Text>
            <Text>{address}</Text>
            <Text>Phone number: {phoneNumber}</Text>
            <Text>cUSD Balance: {cUSDBalance}</Text>

            <Text style={styles.title}>Read HelloWorld</Text>
            <Button title="Read Contract Name" 
                onPress={read} />
            <Text>Contract Name: {contractName}</Text>
        </View>
    );
};

export default Contracts;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#35d07f',
        alignItems: 'center',
        justifyContent: 'center',
    },

    title: {
        marginVertical: 8, 
        fontSize: 20, 
        fontWeight: 'bold'
    },

    contractModal: {
        flex: 1,
        alignItems: 'center',
    },

    infoContainer: {
        width: '70%',
        height: '73%',
    },

    titleText: {
        fontSize: 24,
        marginTop:'8%',
        marginBottom: '5%',
        color: '#2984fb'
    },

    infoText: {
        marginTop: '5%',
        marginBottom: '1%'
    },

    inputContainer: {
        width: '100%',
        height: '7%',
        elevation: 5,
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 5,
        paddingLeft: 13,
        paddingRight: 13,
    },

    inputContainer1: {
        width: '100%',
        height: '9%',
        elevation: 5,
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 5,
        paddingLeft: 13,
        paddingRight: 13,
    },

    date: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: '4.8%',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '7%',
        elevation: 5,
    },

    dateWidth: {
        width: '85%'
    },

    buttonContainer: {
        marginTop: '6%',
        width: '28%',
    },
});
