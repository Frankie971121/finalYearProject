import React from 'react'
import { useState, useEffect, useRef } from 'react'
import '../global'
import { web3, kit } from '../root'
import { Pressable, StyleSheet, Text, View, ActivityIndicator, FlatList } from 'react-native'
import {
    requestAccountAddress,
    waitForAccountAuth,
} from '@celo/dappkit'
import * as Linking from 'expo-linking'
import SmartRentContractFactory from '../contracts/SmartRentFactory.json'
import SmartRentContract from '../contracts/SmartRentContract.json'
import ContractList from './TenantContract'


export default function GetContract({navigation}) {

    const [tenantAddress1, setTenantAddress1] = useState('');
    const tenantAddress1Ref = useRef();
    tenantAddress1Ref.current = tenantAddress1;

    const [contractAddr, setContractAddr] = useState('');
    const [testingData, setTestingData] = useState({
        landlordName: '',
        roomAddress: '',
        startDate: '',
        endDate: '',
        deposit: '',
        rent: '',
        isSigned: '',
        hasPaidDeposit: '',
        landlordAddress: '',
        totalRentLeft: '',
        tenantAddress: '',
        contractAddr: '',
        tenantName: ''
    });
    const testingDataRef = useRef();
    testingDataRef.current = testingData;

    const [contractData, setContractData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            if(tenantAddress1Ref.current != '') {
                setContractData([]);
                const networkId = await web3.eth.net.getId();
                const deployedNetwork = SmartRentContractFactory.networks[networkId];
                const instance = new web3.eth.Contract(
                    SmartRentContractFactory.abi,
                    deployedNetwork && deployedNetwork.address);

                const tenancyInstance = new web3.eth.Contract(
                    SmartRentContract.abi,

                );

                instance.getPastEvents('NewLease', {
                    filter: {tenant: tenantAddress1},
                    fromBlock: 0,
                    toBlock: 'latest'
                })
                .then((logs) => {
                    return logs.map((log) => log.returnValues.contractAddress);
                })
                .then((addresses) => {
                    addresses.forEach(getSmartTenancyData);
                });

                setLoading(false);

                function getSmartTenancyData(address) {
                    let instanceClone = tenancyInstance.clone();
                    instanceClone.options.address = address;
                    let methods = ['landlordName',
                                'roomAddress',
                                'startDate',
                                'endDate',
                                'rentDeposit',
                                'rentAmount',
                                'isSigned',
                                'hasPaidDeposit',
                                'landlordAddress',
                                'totalRentLeft',
                                'tenantAddress',
                                'tenantName'];
                    return Promise.all(methods.map((method) => {
                        return instanceClone.methods[method + '()']().call();
                    }))
                    .then((results) => {
                        results.forEach((data, idx) => {
                            switch (idx) {
                                case 0:
                                    setTestingData((prevState) => ({...prevState, landlordName: data}));
                                    break;
                                case 1:
                                    setTestingData((prevState) => ({...prevState, roomAddress: data}));
                                    break;
                                case 2:
                                    setTestingData((prevState) => ({...prevState, startDate: data}));
                                    break;
                                case 3:
                                    setTestingData((prevState) => ({...prevState, endDate: data}));
                                    break;
                                case 4:
                                    setTestingData((prevState) => ({...prevState, deposit: data}));
                                    break;
                                case 5:
                                    setTestingData((prevState) => ({...prevState, rent: data}));
                                    break;
                                case 6:
                                    setTestingData((prevState) => ({...prevState, isSigned: data}));
                                    break;
                                case 7:
                                    setTestingData((prevState) => ({...prevState, hasPaidDeposit: data}));
                                    break;
                                case 8:
                                    setTestingData((prevState) => ({...prevState, landlordAddress: data}));
                                    break;
                                case 9:
                                    setTestingData((prevState) => ({...prevState, totalRentLeft: data}));
                                    break;
                                case 10:
                                    setTestingData((prevState) => ({...prevState, tenantAddress: data}));
                                    break;
                                case 11:
                                    setTestingData((prevState) => ({...prevState, tenantName: data}));
                                    setTestingData((prevState) => ({...prevState, contractAddr: address}));
                                    setContractData(contractData => [...contractData, testingDataRef.current]);
                                    setTestingData({
                                        landlordName: '',
                                        roomAddress: '',
                                        startDate: '',
                                        endDate: '',
                                        deposit: '',
                                        rent: '',
                                        isSigned: '',
                                        hasPaidDeposit: '',
                                        landlordAddress: '',
                                        totalRentLeft: '',
                                        tenantAddress: '',
                                        tenantName: ''
                                    });
                                    setContractAddr('');
                                    break;
                            }
                        }
                        );
                    });
                };
            }
            else {
                setLoading(false);
            }
        });

        return unsubscribe;
    }, [navigation]);

    const login = async () => {
        const requestId = 'login'
        const dappName = 'Smart Tenancy'
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

        // Update state
        setTenantAddress1(dappkitResponse.address);

        const networkId1 = await web3.eth.net.getId();
        const deployedNetwork = SmartRentContractFactory.networks[networkId1];
        const instance = new web3.eth.Contract(
            SmartRentContractFactory.abi,
            deployedNetwork && deployedNetwork.address);

        const tenancyInstance = new web3.eth.Contract(
            SmartRentContract.abi,

        );

        instance.getPastEvents('NewLease', {
            filter: {tenant: tenantAddress1Ref.current},
            fromBlock: 0,
            toBlock: 'latest'
        })
        .then((logs) => {
            return logs.map((log) => log.returnValues.contractAddress);
        })
        .then((addresses) => {
            addresses.forEach(getSmartTenancyData);
        });

        setLoading(false);

        function getSmartTenancyData(address) {
            let instanceClone = tenancyInstance.clone();
            instanceClone.options.address = address;
            let methods = ['landlordName',
                        'roomAddress',
                        'startDate',
                        'endDate',
                        'rentDeposit',
                        'rentAmount',
                        'isSigned',
                        'hasPaidDeposit',
                        'landlordAddress',
                        'totalRentLeft',
                        'tenantAddress',
                        'tenantName'];
            return Promise.all(methods.map((method) => {
                return instanceClone.methods[method + '()']().call();
            }))
            .then((results) => {
                results.forEach((data, idx) => {
                    switch (idx) {
                        case 0:
                            setTestingData((prevState) => ({...prevState, landlordName: data}));
                            break;
                        case 1:
                            setTestingData((prevState) => ({...prevState, roomAddress: data}));
                            break;
                        case 2:
                            setTestingData((prevState) => ({...prevState, startDate: data}));
                            break;
                        case 3:
                            setTestingData((prevState) => ({...prevState, endDate: data}));
                            break;
                        case 4:
                            setTestingData((prevState) => ({...prevState, deposit: data}));
                            break;
                        case 5:
                            setTestingData((prevState) => ({...prevState, rent: data}));
                            break;
                        case 6:
                            setTestingData((prevState) => ({...prevState, isSigned: data}));
                            break;
                        case 7:
                            setTestingData((prevState) => ({...prevState, hasPaidDeposit: data}));
                            break;
                        case 8:
                            setTestingData((prevState) => ({...prevState, landlordAddress: data}));
                            break;
                        case 9:
                            setTestingData((prevState) => ({...prevState, totalRentLeft: data}));
                            break;
                        case 10:
                            setTestingData((prevState) => ({...prevState, tenantAddress: data}));
                            break;
                        case 11:
                            setTestingData((prevState) => ({...prevState, tenantName: data}));
                            setTestingData((prevState) => ({...prevState, contractAddr: address}));
                            setContractData(contractData => [...contractData, testingDataRef.current]);
                            setTestingData({
                                landlordName: '',
                                roomAddress: '',
                                startDate: '',
                                endDate: '',
                                deposit: '',
                                rent: '',
                                isSigned: '',
                                hasPaidDeposit: '',
                                landlordAddress: '',
                                totalRentLeft: '',
                                tenantAddress: '',
                                tenantName: ''
                            });
                            setContractAddr('');
                            break;
                    }
                }
                );
            });
        };
    }

    if(loading) {
        return <ActivityIndicator />
    }
    else if(loading == false && contractData.length == 0 && tenantAddress1 != '') {
        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text style={{fontSize: 22}}>Empty Result</Text></View>
    }
    else if(loading == false && contractData.length == 0) {
        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Pressable style={styles.button} onPress={login}>
                        <Text style={styles.contractText}>Login Account</Text>
                    </Pressable>
                </View>
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Tenancy Contracts</Text>
            <View style={styles.table}>
                <View style={{width: '23%', alignItems: 'center'}}>
                    <Text style={styles.header}>Status</Text>
                </View>
                <View style={{width: '60%', alignItems: 'center'}}>
                    <Text style={styles.header}>Contract Address</Text>
                </View>
            </View>
            <FlatList
                style={styles.contractContainer}
                data={contractData}
                renderItem={({ item }) => (
                    <ContractList contractData={item} />
                )}
                keyExtractor={(item, index) => index.toString()} />
        </View>
    )
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingTop: '10%',
        alignItems: 'center',
        backgroundColor: 'white',
    },

    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#E56717',
    },

    table: {
        flexDirection: 'row',
        marginTop: '10%',
        borderBottomWidth: 0.7,
        width: '90%',
        paddingBottom: '2%'
    },

    header: {
        fontWeight: 'bold',
        fontSize: 16
    },

    contractContainer: {
        marginTop: '3%',
        marginBottom: '4%',
    },

    buttonCon: {
        alignItems: 'center',
        height: '20%',
    },

    button: {
        borderWidth: 2,
        borderRadius: 10,
        borderColor: 'green',
        width: '35%',
        height: '10%',
        justifyContent: 'center',
        alignItems: 'center'
    },

    contractText: {
        fontSize: 15,
    },
});
