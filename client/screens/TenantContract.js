import React from 'react'
import { View, Pressable, Text, TextInput, Alert, StatusBar, StyleSheet, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'

const TenantContract = (props) => {

    const navigation = useNavigation();
    
    const [isSigned, setIsSigned] = useState(props.contractData.isSigned);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.landlord}>
                {isSigned ? 
                        <View style={styles.status}>
                            <Text style={{textAlign: 'center', fontSize: 12, fontWeight: 'bold'}}>Active</Text>
                        </View> :
                        <View style={styles.secondStatus}>
                            <Text style={{textAlign: 'center', fontSize: 12, fontWeight: 'bold'}}>Not Active</Text>    
                        </View>}
            </View>
            <View style={styles.contract}>
                <Text style={styles.contractTitle}>{props.contractData.contractAddr}</Text>
            </View>
            <View style={styles.viewContainer}>
                <Pressable style={styles.view} onPress={() => {
                    navigation.navigate('ContractDetail', {
                        post: props,
                    });
                }}>
                    <Text style={styles.viewTitle}>View</Text>
                </Pressable>
            </View>
        </View>
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
        width: '82%',
        height: '70%',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: 'red'
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
})

export default TenantContract;