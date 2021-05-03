import React from 'react'
import { useState, useEffect, useRef } from 'react'
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
import SmartRentContract from '../contracts/SmartRentFactory.json'
import { Overlay } from 'react-native-elements'
import DateTimePicker from '@react-native-community/datetimepicker'
import Fontisto from 'react-native-vector-icons/Fontisto'
import BigNumber from "bignumber.js";
import moment from 'moment'

const CreateContracts = () => {

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
    const startDateRef = useRef();
    startDateRef.current = startDate;

    const [endDate, setEndDate] = useState(new Date());
    const endDateRef = useRef();
    endDateRef.current = endDate;

    const [mode1, setMode1] = useState('date');
    const [show1, setShow1] = useState(false);
    const [mode2, setMode2] = useState('date');
    const [show2, setShow2] = useState(false);
    const [deposit, setDeposit] = useState(null);
    const [rent, setRent] = useState(null);
    const [tenantAddress, setTenantAddress] = useState(null);

    const [startDateString, setStartDateString] = useState('');
    const [endDateString, setEndDateString] = useState('');

    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        (async () => {
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = SmartRentContract.networks[networkId];

            // Create a new contract instance with the HelloWorld contract info
            const instance = new web3.eth.Contract(
                SmartRentContract.abi,
                deployedNetwork && deployedNetwork.address
            );

            // Save the contract instance
            setSmartRentContract(instance);
            setLoading(false);
        })();
    }, []);

    if(loading) {
        return <ActivityIndicator />;
    }

    const deployContract = async () => {
        const requestId = 'deploy_contract'
        const dappName = 'Smart Rental'
        const callback = Linking.makeUrl('/my/path')

        let startDateUnix = moment(startDate, "YYYY-MM-DD").unix();
        let endDateUnix = moment(endDate, "YYYY-MM-DD").unix();
        let depositBigNum = new BigNumber(deposit * 10**18);
        let rentBigNum = new BigNumber(rent * 10**18);

        const txObject = await smartRentContract.methods.createRent(name, address, roomAddress, startDateUnix, endDateUnix, depositBigNum, rentBigNum, tenantAddress)

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

        const dappkitResponse = await waitForSignedTxs(requestId)
        const tx = dappkitResponse.rawTxs[0]

        // Get the transaction result, once it has been included in the Celo blockchain
        let result = await toTxResult(kit.web3.eth.sendSignedTransaction(tx)).waitReceipt()

        console.log(`Smart Rent Contract Created receipt: `, result)

        setModalVisible(false);
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
        const currentMonth = startDateRef.current.getMonth() + 1;
        const currentDateString = startDateRef.current.getDate() + '/' + currentMonth + '/' + startDateRef.current.getFullYear();
        setStartDateString(currentDateString);
    }

    const onChangeEndDate = (event, selectedDate) => {
        const currentDate1 = selectedDate || date;
        setShow2(false);
        setEndDate(currentDate1);
        const currentMonth = endDateRef.current.getMonth() + 1;
        const currentDateString1 = endDateRef.current.getDate() + '/' + currentMonth + '/' + endDateRef.current.getFullYear();
        setEndDateString(currentDateString1);
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Text style={styles.mainTitle}>Smart Tenancy Contract</Text>

            <View style={styles.infoBox} >
                <Text style={styles.title}>Step 1: Login Celo Alfajores Wallet</Text>
                <Pressable onPress={login}>
                    <Text style={styles.login}>Click to Login</Text>
                </Pressable>
                <Text style={styles.accountCon}>Account Address:</Text>
                <Text style={styles.accountInfo}>{address}</Text>
                <Text style={styles.accountCon}>Phone number:</Text>
                <Text style={styles.accountInfo}>{phoneNumber}</Text>
                <Text style={styles.accountCon}>cUSD Balance:</Text>
                <Text style={styles.accountInfo}>{cUSDBalance}</Text>

                <Text style={styles.title}>Step 2: Create New Contract</Text>
                <View style={styles.buttonCon}>
                    <Pressable style={styles.button} onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={styles.contractText}>Create Contract</Text>
                    </Pressable>
                </View>
                {deploying ? (
                    <Overlay isVisible={true} overlayStyle={{width:150, alignItems: 'center'}}>
                        <Text>Creating...</Text>
                    </Overlay>
                    ) : null}
            </View>

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

                            <Text style={styles.infoText}>Security Deposit in CELO (1 CELO = $5.09 = RM20.89)</Text>
                            <TextInput
                                style={styles.inputContainer}
                                label="Deposit"
                                placeholder="Deposit"
                                onChangeText={(inputDeposit) => {
                                    setDeposit(inputDeposit);
                                }}
                            />

                            <Text style={styles.infoText}>Total Rent in CELO (1 CELO = $5.09 = RM20.89)</Text>
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
                                onPress={deployContract}
                            />
                        </View>
                    </View>
                </Modal>
        </View>
    );
};

export default CreateContracts;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },

    mainTitle: {
        marginTop: '15%',
        fontSize: 22,
        fontWeight: 'bold',
        paddingBottom: '2%',
        color: '#348017',
    },

    infoBox: {
        marginTop: '1%',
        width: '80%',
    },

    title: {
        marginVertical: "2%",
        marginTop: '7%', 
        fontSize: 16, 
    },

    login: {
        color: '#1589FF',
        fontSize: 15, 
        textDecorationLine: 'underline'
    },

    accountCon: {
        color: '#842DCE',
        marginTop: '5%',
        fontSize: 16,
    },

    accountInfo: {
        fontStyle: 'italic'
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
        height: '6%',
        elevation: 5,
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 5,
        paddingLeft: 13,
        paddingRight: 13,
    },

    inputContainer1: {
        width: '100%',
        height: '7%',
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

    buttonCon: {
        alignItems: 'center',
        height: '20%',
        marginTop: '5%'
    },

    button: {
        borderWidth: 2,
        borderRadius: 10,
        borderColor: 'green',
        width: '50%',
        height: '55%',
        justifyContent: 'center',
        alignItems: 'center'
    },

    contractText: {
        fontSize: 15,
    },
});
