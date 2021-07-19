import React from 'react'
import { View, TouchableOpacity, Text, TextInput, Alert, StatusBar, StyleSheet, ScrollView, Button } from 'react-native'
import { useState, useEffect } from 'react'
import SmartRentContract from '../contracts/SmartRentContract.json'
import BigNumber from "bignumber.js"
import moment from 'moment'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { web3, kit } from '../root'
import {
    requestTxSig,
    waitForSignedTxs,
    FeeCurrency
} from '@celo/dappkit'
import { toTxResult } from "@celo/connect"
import * as Linking from 'expo-linking'

export default function ContractDetail(props) {

    const depositInInt = props.route.params.post.contractData.deposit / 10**18;
    const rentInInt = props.route.params.post.contractData.rent / 10**18;

    const [rentAmount, setRentAmount] = useState(null);

    const [totalRentLeftInInt, setTotalRentLeftInInt] = useState(props.route.params.post.contractData.totalRentLeft / 10**18);
    const [isSigned, setIsSigned] = useState(props.route.params.post.contractData.isSigned);
    const [paidDeposit, setPaidDeposit] = useState(props.route.params.post.contractData.hasPaidDeposit);

    const startDate = moment.unix(props.route.params.post.contractData.startDate).format('DD-MM-YYYY');
    const endDate = moment.unix(props.route.params.post.contractData.endDate).format('DD-MM-YYYY');

    const signContract = async () => {
        const networkId = await web3.eth.net.getId();
        const contractAddressInstance = props.route.params.post.contractData.contractAddr;
        const instance = new web3.eth.Contract(
            SmartRentContract.abi,
            contractAddressInstance
        );

        const requestId = 'sign_contract'
        const dappName = 'Smart Rental'
        const callback = Linking.makeUrl('/my/path')

        const txObject = await instance.methods.signContract();

        requestTxSig(
            kit,
            [
                {
                    from: props.route.params.post.contractData.tenantAddress,
                    to: instance.options.address,
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
        setIsSigned(true);
    }

    const payDeposit = async () => {
        const networkId = await web3.eth.net.getId();
        const contractAddressInstance = props.route.params.post.contractData.contractAddr;
        const instance = new web3.eth.Contract(
            SmartRentContract.abi,
            contractAddressInstance
        );

        const requestId = 'pay_deposit'
        const dappName = 'Smart Rental'
        const callback = Linking.makeUrl('/my/path')

        const txObject = await instance.methods.payDeposit();
        let newAmount = new BigNumber(props.route.params.post.contractData.deposit);

        requestTxSig(
            kit,
            [
                {
                    from: props.route.params.post.contractData.tenantAddress,
                    to: instance.options.address,
                    tx: txObject,
                    feeCurrency: FeeCurrency.cUSD,
                    value: newAmount
                }
            ],
            { requestId, dappName, callback }
        ).then(() => console.log('Passed'))
        .catch((err) => {
            Alert.alert(
                "Error!",
                err.message
            );
        })

        const dappkitResponse = await waitForSignedTxs(requestId)
        const tx = dappkitResponse.rawTxs[0]

        const t0 = performance.now();

        // Get the transaction result, once it has been included in the Celo blockchain
        let result = await toTxResult(kit.web3.eth.sendSignedTransaction(tx)).waitReceipt()
        
        const t1 = performance.now();
        console.log("T0" + t0);
        console.log("T1" + t1);
        console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);

        setPaidDeposit(true);
        console.log("Done");
    }

    const withdrawDeposit = async () => {
        const networkId = await web3.eth.net.getId();
        const contractAddressInstance = props.route.params.post.contractData.contractAddr;
        const instance = new web3.eth.Contract(
            SmartRentContract.abi,
            contractAddressInstance
        );

        const requestId = 'withdraw_deposit'
        const dappName = 'Smart Rental'
        const callback = Linking.makeUrl('/my/path')

        const txObject = await instance.methods.withdrawDeposit();

        requestTxSig(
            kit,
            [
                {
                    from: props.route.params.post.contractData.tenantAddress,
                    to: instance.options.address,
                    tx: txObject,
                    feeCurrency: FeeCurrency.cUSD,
                }
            ],
            { requestId, dappName, callback }
        ).then(() => console.log("done"))
        .catch((err) => {
            Alert.alert(
                "Error!",
                err.message
            );
        })

        const dappkitResponse = await waitForSignedTxs(requestId)
        const tx = dappkitResponse.rawTxs[0]

        // Get the transaction result, once it has been included in the Celo blockchain
        let result = await toTxResult(kit.web3.eth.sendSignedTransaction(tx)).waitReceipt()
        console.log(`Rent Paid Receipt: `, result)
    }

    const payRent1 = async () => {
        const networkId = await web3.eth.net.getId();
        const contractAddressInstance = props.route.params.post.contractData.contractAddr;
        const instance = new web3.eth.Contract(
            SmartRentContract.abi,
            contractAddressInstance
        );

        const requestId = 'pay_rent'
        const dappName = 'Smart Rental'
        const callback = Linking.makeUrl('/my/path')

        const txObject = await instance.methods.payRent();
        let rentInInt = rentAmount * 10**18;

        requestTxSig(
            kit,
            [
                {
                    from: props.route.params.post.contractData.tenantAddress,
                    to: instance.options.address,
                    tx: txObject,
                    feeCurrency: FeeCurrency.cUSD,
                    value: rentInInt
                }
            ],
            { requestId, dappName, callback }
        ).then(() => console.log("done"))
        .catch((err) => {
            Alert.alert(
                "Error!",
                err.message
            );
        })

        const dappkitResponse = await waitForSignedTxs(requestId)
        const tx = dappkitResponse.rawTxs[0]

        const t0 = performance.now();

        // Get the transaction result, once it has been included in the Celo blockchain
        let result = await toTxResult(kit.web3.eth.sendSignedTransaction(tx)).waitReceipt()

        const t1 = performance.now();
        
        let amountLeft = totalRentLeftInInt - rentAmount;
        setTotalRentLeftInInt(amountLeft);
    }

    return (
        <ScrollView contentContainerStyle={{paddingVertical: 10}}>
            <StatusBar style="light" />
            <View style={{flex: 1}}>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={styles.topTitle}>Agreement</Text>
                </View>
                <View style={styles.bottomContainer}>
                    <Text style={styles.dataTitle}>Landlord:  <Text style={styles.data}>{props.route.params.post.contractData.landlordName}</Text></Text>
                    <Text style={styles.dataTitle}>Landlord Account:  <Text style={styles.data}>{props.route.params.post.contractData.landlordAddress}</Text></Text>
                    <Text style={styles.dataTitle}>Tenant:  <Text style={styles.data}>{props.route.params.post.contractData.tenantName}</Text></Text>
                    <Text style={styles.dataTitle}>Tenant Account:  <Text style={styles.data}>{props.route.params.post.contractData.tenantAddress}</Text></Text>
                    <Text style={styles.dataTitle}>Room Address:  <Text style={styles.data}>{props.route.params.post.contractData.roomAddress}</Text></Text>
                    <Text style={styles.dataTitle}>Start Date:  <Text style={styles.data}>{startDate}</Text></Text>
                    <Text style={styles.dataTitle}>End Date:  <Text style={styles.data}>{endDate}</Text></Text>
                    <Text style={styles.dataTitle}>Deposit:  <Text style={styles.data}>{depositInInt} CELO</Text></Text>
                    <Text style={styles.dataTitle}>Total Rent:  <Text style={styles.data}>{rentInInt} CELO</Text></Text>
                    <Text style={styles.dataTitle}>Outstanding Rent:  <Text style={styles.data}>{totalRentLeftInInt} CELO</Text></Text>
                    <Text style={styles.dataTitle}>Signed:  {isSigned ? <FontAwesome name="check" size={18} color="green"/> : <FontAwesome name="close" size={18} color="red"/>}</Text>
                    <Text style={styles.dataTitle}>Deposit Paid:  {paidDeposit ? <FontAwesome name="check" size={18} color="green"/> : <FontAwesome name="close" size={18} color="red"/>}</Text>
                    <Text style={styles.dataTitle}>Terms & Conditions:</Text>
                    <View style={styles.tncContainer}>
                        <View style={{marginLeft: '2%'}}>
                            <Text style={{fontSize: 10, marginTop: 2}}>⬤</Text>
                            <Text style={styles.dot}>⬤</Text>
                            <Text style={styles.dot}>⬤</Text>
                        </View>
                        <View style={styles.tncContainer1}>
                            <Text style={styles.tcData}>Tenancy Agreement shall be signed by tenant to activate the contract.</Text>
                            <Text style={styles.tcData}>Tenant is required to pay rental deposit before moving in and make rent payment.</Text>
                            <Text style={styles.tcData}>Tenant cannot withdraw rental deposit if there were any unpaid rent after period end.</Text>
                        </View>
                    </View>
                    <View style={styles.signContainer}>
                        {isSigned ? null :
                            <TouchableOpacity style={styles.signButton} onPress={signContract}>
                                <Text style={styles.sign}>Sign</Text>
                            </TouchableOpacity> }
                        {paidDeposit ? null :
                            <TouchableOpacity style={styles.payDepositButton} onPress={payDeposit}>
                                <Text style={styles.payDeposit}>Pay Deposit</Text>
                            </TouchableOpacity> }
                        {isSigned && paidDeposit ? (
                            <View style={styles.container1}>
                                <TextInput
                                    style={styles.inputContainer}
                                    label="payRent"
                                    placeholder="Enter amount..."
                                    onChangeText={(inputRent) => {
                                        setRentAmount(inputRent);
                                    }}/>
                                <TouchableOpacity style={styles.payRentButton} onPress={payRent1}>
                                    <Text style={styles.sign}>Pay Rent</Text>
                                </TouchableOpacity>
                            </View>) : null }
                        {isSigned && paidDeposit ? 
                            <TouchableOpacity style={styles.withdrawDepositButton} onPress={withdrawDeposit}>
                                <Text style={styles.payDeposit}>Withdraw Deposit</Text>
                            </TouchableOpacity> : null }
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    
    topTitle: {
        marginTop: '3%',
        fontSize: 22,
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },

    bottomContainer: {
        marginTop: '3%',
        paddingLeft: '4%',
        paddingRight: '4%'
    },

    dataTitle: {
        marginTop: '3%',
        fontSize: 16,
    },

    data: {
        color: '#7D1B7E',
        fontSize: 16,
        fontWeight: 'bold'
    },

    tncContainer: {
        borderWidth: 0.7,
        borderRadius: 10,
        marginTop: '2%',
        padding: '2%',
        flexDirection: 'row'
    },

    dot: {
        fontSize: 10,
        marginTop: 23,
    },

    tncContainer1: {
        marginLeft: '2%',
        marginRight: '4%'
    },

    tcData: {
        fontFamily: 'serif',
        fontSize: 13,
        marginBottom: '1.5%',
        color: '#F70D1A'
    },

    signContainer: {
        alignItems: 'center',
        height: 200,
    },

    signButton: {
        marginTop: '10%',
        width: "37%",
        height: '22%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#41A317'
    },

    sign: {
        color: 'white'
    },

    payDepositButton: {
        marginTop: '5%',
        width: "40%",
        height: '22%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#C11B17'
    },

    withdrawDepositButton: {
        width: "50%",
        height: '22%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#C11B17'
    },

    payDeposit: {
        color: 'white'
    },

    container1: {
        marginTop: '2%',
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
        height: '55%',
    },

    inputContainer: {
        height: '30%',
        borderBottomWidth: 0.5,
        backgroundColor: 'white',
        borderRadius: 5,
        paddingLeft: 13,
        paddingRight: 13,
    },

    payRentButton: {
        marginTop: '8%',
        width: "70%",
        height: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#3090C7'
    },
})
