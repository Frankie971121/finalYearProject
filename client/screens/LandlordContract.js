import React from 'react'
import { View, Pressable, Text, TextInput, Dimensions, StatusBar, StyleSheet } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { web3, kit } from '../root'
import {
    requestTxSig,
    waitForSignedTxs,
    FeeCurrency
} from '@celo/dappkit'
import { toTxResult } from "@celo/connect"
import * as Linking from 'expo-linking'
import { Overlay } from 'react-native-elements'
import { useState, useEffect } from 'react'
import moment from 'moment'
import SmartRentContract from '../contracts/SmartRentContract.json'

const Contract = (props) => {

    const [visible, setVisible] = useState(false);
    const [rentAmount, setRentAmount] = useState(null);
    const [isSigned, setIsSigned] = useState(props.contractData.isSigned);
    const [paidDeposit, setPaidDeposit] = useState(props.contractData.hasPaidDeposit);
    const depositInInt = props.contractData.deposit / 10**18;
    const rentInInt = props.contractData.rent / 10**18;
    const totalRentLeftInInt = props.contractData.totalRentLeft / 10**18;

    const withdrawRent = async () => {
        const contractAddressInstance = props.contractData.contractAddr;
        const instance = new web3.eth.Contract(
            SmartRentContract.abi,
            contractAddressInstance
        );

        const requestId = 'withdraw_rent'
        const dappName = 'Smart Rental'
        const callback = Linking.makeUrl('/my/path')

        const txObject = await instance.methods.withdrawRent();

        requestTxSig(
            kit,
            [
                {
                    from: props.contractData.landlordAddress,
                    to: instance.options.address,
                    tx: txObject,
                    feeCurrency: FeeCurrency.cUSD,
                }
            ],
            { requestId, dappName, callback }
        )

        const dappkitResponse = await waitForSignedTxs(requestId)
        const tx = dappkitResponse.rawTxs[0]

        // Get the transaction result, once it has been included in the Celo blockchain
        let result = await toTxResult(kit.web3.eth.sendSignedTransaction(tx)).waitReceipt()
        console.log(`Rent Withdrawn Receipt: `, result)
    }

    const claimDeposit = async () => {
        const contractAddressInstance = props.contractData.contractAddr;
        const instance = new web3.eth.Contract(
            SmartRentContract.abi,
            contractAddressInstance
        );

        const requestId = 'claim_deposit'
        const dappName = 'Smart Rental'
        const callback = Linking.makeUrl('/my/path')

        const txObject = await instance.methods.claimDeposit();

        requestTxSig(
            kit,
            [
                {
                    from: props.contractData.landlordAddress,
                    to: instance.options.address,
                    tx: txObject,
                    feeCurrency: FeeCurrency.cUSD,
                }
            ],
            { requestId, dappName, callback }
        )

        const dappkitResponse = await waitForSignedTxs(requestId)
        const tx = dappkitResponse.rawTxs[0]

        // Get the transaction result, once it has been included in the Celo blockchain
        let result = await toTxResult(kit.web3.eth.sendSignedTransaction(tx)).waitReceipt()
        console.log(`Deposit Claimed Receipt: `, result)
    }

    const startDate = moment.unix(props.contractData.startDate).format('DD-MM-YYYY');
    const endDate = moment.unix(props.contractData.endDate).format('DD-MM-YYYY');

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.landlord}>
                {isSigned ? 
                    <View style={styles.status}>
                        <Text style={{textAlign: 'center', fontSize: 12, fontWeight: 'bold'}}>Signed</Text>
                    </View> :
                    <View style={styles.secondStatus}>
                        <Text style={{textAlign: 'center', fontSize: 12, fontWeight: 'bold'}}>Not Signed</Text>    
                    </View>}
                
            </View>
            <View style={styles.contract}>
                <Text style={styles.contractTitle}>{props.contractData.contractAddr}</Text>
            </View>
            <View style={styles.viewContainer}>
                <Pressable style={styles.view} onPress={() => setVisible(!visible)}>
                    <Text style={styles.viewTitle}>View</Text>
                </Pressable>
            </View>
            <Overlay
                    isVisible={visible}
                    onBackdropPress={() => setVisible(!visible)}
                    overlayStyle={styles.overlay}>
                        <View style={styles.overlayView}>
                            <Text style={styles.dataTitle}>From:  <Text style={styles.data}>{props.contractData.landlordAddress}</Text></Text>
                            <Text style={styles.dataTitle}>To:  <Text style={styles.data}>{props.contractData.tenantAddress}</Text></Text>
                            <Text style={styles.dataTitle}>Landlord:  <Text style={styles.data}>{props.contractData.landlordName}</Text></Text>
                            <Text style={styles.dataTitle}>Room Address:  <Text style={styles.data}>{props.contractData.roomAddress}</Text></Text>
                            <Text style={styles.dataTitle}>Start Date:  <Text style={styles.data}>{startDate}</Text></Text>
                            <Text style={styles.dataTitle}>End Date:  <Text style={styles.data}>{endDate}</Text></Text>
                            <Text style={styles.dataTitle}>Deposit:  <Text style={styles.data}>{depositInInt} CELO</Text></Text>
                            <Text style={styles.dataTitle}>Total Rent:  <Text style={styles.data}>{rentInInt} CELO</Text></Text>
                            <Text style={styles.dataTitle}>Outstanding Rent:  <Text style={styles.data}>{totalRentLeftInInt} CELO</Text></Text>
                            <Text style={styles.dataTitle}>Signed:  {isSigned ? <FontAwesome name="check" size={18} /> : <FontAwesome name="close" size={18} />}</Text>
                            <Text style={styles.dataTitle}>Deposit Paid:  {paidDeposit ? <FontAwesome name="check" size={18} /> : <FontAwesome name="close" size={18} />}</Text>
                            <View style={styles.signContainer}>
                                {isSigned && paidDeposit ? 
                                    <Pressable style={styles.withdrawRenttButton} onPress={withdrawRent}>
                                        <Text style={styles.payDeposit}>Withdraw Rent</Text>
                                    </Pressable> : null }
                                {isSigned && paidDeposit ? 
                                    <Pressable style={styles.claimDepositButton} onPress={claimDeposit}>
                                        <Text style={styles.payDeposit}>Claim Deposit</Text>
                                    </Pressable> : null }
                            </View>
                        </View>
                </Overlay>
        </View>
        //</Pressable>
    )
};

const styles = StyleSheet.create({
    container: {
        marginBottom: '5%',
        marginHorizontal: '5%',
        borderRadius: 10,
        elevation: 5,
        backgroundColor: 'white',
        flexDirection: 'row',
        height: 55,
    },

    landlord: {
        width: '23%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: '2%',
        paddingRight: '2%',
    },

    status: {
        width: '85%',
        height: '50%',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#59E817'
    },

    secondStatus: {
        width: '85%',
        height: '70%',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#FBB917'
    },

    contract: {
        width: '62%',
        justifyContent: 'center',
        alignItems: 'center'
    },

    contractTitle: {
        fontStyle: 'italic',
        fontSize: 13,
        color: '#348017'
    },

    viewContainer: {
        width: '15%',
        justifyContent: 'center',
        alignItems: 'center'
    },

    viewTitle: {
        color: '#306EFF',
        textDecorationLine: 'underline'
    },

    overlay: {
        height: '82%',
        width: '85%',
        borderRadius: 20,
        alignItems: 'center',
    },

    overlayView: {
        width: '90%',
        marginTop: '5%'
    },

    dataTitle: {
        marginTop: '3%',
        fontSize: 15,
    },

    data: {
        fontStyle: 'italic',
        color: '#0020C2',
        fontSize: 16,
    },

    signContainer: {
        alignItems: 'center',
        height: '35%',
    },

    signButton: {
        marginTop: '13%',
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
        width: "50%",
        height: '22%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#C11B17'
    },

    withdrawRenttButton: {
        marginTop: '10%',
        width: "47%",
        height: '22%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#52D017'
    },

    claimDepositButton: {
        marginTop: '5%',
        width: "47%",
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
        height: '55%'
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

export default Contract;