import React from 'react'
import { View, Text } from 'react-native'

export default function EmptyResult() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 22, color: 'grey', fontStyle: 'italic'}}>No Result Found</Text>
        </View>
    )
}
