import React from 'react'
import { View, Modal, Text, FlatList, StyleSheet, Dimensions, Alert, ActivityIndicator, Pressable, TextInput, TouchableOpacity } from 'react-native'
import { db, auth } from '../utils/FirebaseConfig'
import { useState, useEffect } from 'react'
import Post from './PostResult'
import EmptyResult from './EmptyResult'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Picker } from '@react-native-picker/picker'
import { Overlay } from 'react-native-elements'
import { and } from 'react-native-reanimated'

const {width, height} = Dimensions.get('window');

export default function SearchResult(props) {

    const data = props.route.params.input;
    const [post, setPost] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000);
    const [clickSingle, setClickSingle] = useState(false);
    const [clickMiddle, setClickMiddle] = useState(false);
    const [clickMaster, setClickMaster] = useState(false);
    const [clickStudio, setClickStudio] = useState(false);
    const [minSize, setMinSize] = useState(0);
    const [maxSize, setMaxSize] = useState(200);
    const [preference, setPreference] = useState(null);
    const [filtering, setFiltering] = useState(false);

    useEffect(() => {
        (async () => {
            await db.collectionGroup('userPosts')
                    .where('location', '==', data)
                    .get()
                    .then(querySnapshot => {
                        if(querySnapshot.size == 0) {
                            setLoading(false);
                        }
                        else {
                            const userPosts = [];
                            querySnapshot.forEach((doc) => {
                                userPosts.push({
                                    ...doc.data(),
                                    key: doc.id,
                                });
                                setPost(userPosts);
                                setLoading(false);
                            });
                        }
                    });
        })();
    }, []);

    const onBack = () => {

    };

    const applyFilter = async () => {
        
        setFiltering(true);

        var roomType = [];

        if(clickSingle == true && clickMiddle == true && clickMaster == true && clickStudio == true) {
            roomType = ['Single Room', 'Middle Room', 'Master Room' , 'Studio'];
        }
        else if(clickSingle == true && clickMiddle == true && clickMaster == true) {
            roomType = ['Single Room', 'Middle Room', 'Master Room'];
        }
        else if(clickSingle == true && clickMiddle == true) {
            roomType = ['Single Room', 'Middle Room'];
        }
        else if(clickSingle == true) {
            roomType = ['Single Room'];
        }
        else if(clickMiddle == true && clickMaster == true && clickStudio == true) {
            roomType = ['Middle Room', 'Master Room', 'Studio'];
        }
        else if(clickMiddle == true && clickMaster == true) {
            roomType = ['Middle Room', 'Master Room'];
        }
        else if(clickMiddle == true) {
            roomType = ['Middle Room'];
        }
        else if(clickMaster == true && clickStudio == true) {
            roomType = ['Master Room' , 'Studio'];
        }
        else if(clickMaster == true) {
            roomType = ['Master Room'];
        }
        else if(clickStudio == true) {
            roomType = ['Studio'];
        }
        else {
            roomType = ['Single Room', 'Middle Room', 'Master Room' , 'Studio'];
        }

        if(preference != null) {
            await db.collectionGroup('userPosts')
            .where('location', '==', data)
            .where('price', '>=', minPrice)
            .where('price', '<=', maxPrice)
            .where('type', 'in', roomType)
            .where('preference', '==', preference)
            .get()
            .then(querySnapshot => {
                if(querySnapshot.size == 0) {
                    setPost([]);
                    setMinPrice(0);
                    setMaxPrice(10000);
                    setClickSingle(false);
                    setClickMiddle(false);
                    setClickMaster(false);
                    setClickStudio(false);
                    setMinSize(0);
                    setMaxSize(200);
                    setPreference(null);
                    setLoading(false);
                    setFiltering(false);
                    setModalVisible(!modalVisible);
                }
                else {
                    const newUserPosts = [];
                    querySnapshot.forEach((doc) => {
                        newUserPosts.push({
                            ...doc.data(),
                            key: doc.id,
                        });
                        setPost(newUserPosts);
                        setMinPrice(0);
                        setMaxPrice(10000);
                        setClickSingle(false);
                        setClickMiddle(false);
                        setClickMaster(false);
                        setClickStudio(false);
                        setMinSize(0);
                        setMaxSize(200);
                        setPreference(null);
                        setLoading(false);
                        setFiltering(false);
                        setModalVisible(!modalVisible);
                    });
                }
            });
        }
        else {
            await db.collectionGroup('userPosts')
            .where('location', '==', data)
            .where('price', '>=', minPrice)
            .where('price', '<=', maxPrice)
            .where('type', 'in', roomType)
            .get()
            .then(querySnapshot => {
                if(querySnapshot.size == 0) {
                    setPost([]);
                    setMinPrice(0);
                    setMaxPrice(10000);
                    setClickSingle(false);
                    setClickMiddle(false);
                    setClickMaster(false);
                    setClickStudio(false);
                    setMinSize(0);
                    setMaxSize(200);
                    setPreference(null);
                    setLoading(false);
                    setFiltering(false);
                    setModalVisible(!modalVisible);
                }
                else {
                    const newUserPosts = [];
                    querySnapshot.forEach((doc) => {
                        newUserPosts.push({
                            ...doc.data(),
                            key: doc.id,
                        });
                        setPost(newUserPosts);
                        setMinPrice(0);
                        setMaxPrice(10000);
                        setClickSingle(false);
                        setClickMiddle(false);
                        setClickMaster(false);
                        setClickStudio(false);
                        setMinSize(0);
                        setMaxSize(200);
                        setPreference(null);
                        setLoading(false);
                        setFiltering(false);
                        setModalVisible(!modalVisible);
                    });
                }
            });
        }
         
    };

    if(loading) {
        return <ActivityIndicator />;
    }

    else if(post.length == 0) {
        return <EmptyResult />
    }

    return (
        <View style={styles.container}>
            <View style={styles.barContainer}>
                <Pressable style={styles.arrow} onPress={onBack}>
                    <Ionicons name="arrow-back" size={24} />
                </Pressable>
                <TextInput
                    style={styles.searchBar}
                    label="area"
                    value={props.route.params.input}
                    onChangeText={(inputArea) => {
                        setArea(inputArea);
                    }}
                />
                <Pressable style={styles.filter} onPress={() => setModalVisible(!modalVisible)}>
                    <Ionicons name="filter-outline" size={24} />
                </Pressable>
            </View>
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {setModalVisible(!modalVisible);}}>
                    <View style={styles.filterContainer}>
                        <View style={styles.barContainer}>
                            <Pressable style={styles.arrow} onPress={onBack}>
                                <Ionicons name="arrow-back" size={24} />
                            </Pressable>
                        </View>
                        <View style={{marginLeft: 15, marginRight: 15}}>
                            <Text style={styles.title}>Price (RM)</Text>
                            <View style={styles.priceContainer}>
                                <TextInput
                                    style={styles.inputContainer}
                                    label="minPrice"
                                    placeholder="Min. Price"
                                    onChangeText={(inputMinPrice) => {
                                        setMinPrice(inputMinPrice);
                                    }} />
                                <TextInput
                                    style={styles.inputContainer}
                                    label="maxPrice"
                                    placeholder="Max. Price"
                                    onChangeText={(inputMaxPrice) => {
                                        setMaxPrice(inputMaxPrice);
                                    }} />
                            </View>
                            <Text style={styles.title}>Room Type</Text>
                            <View style={styles.roomContainer}>
                                <Pressable
                                    style={clickSingle ? styles.inputTypeClick : styles.inputType}
                                    onPress={() => setClickSingle(!clickSingle)} >
                                        <Text style={clickSingle ? {color: 'white'} : {color: 'black'}}>Single Room</Text>
                                </Pressable>
                                <Pressable
                                    style={clickMiddle ? styles.inputTypeClick1 : styles.inputType1}
                                    onPress={() => setClickMiddle(!clickMiddle)} >
                                    <Text style={clickMiddle ? {color: 'white'} : {color: 'black'}}>Middle Room</Text>
                                </Pressable>
                                <Pressable
                                    style={clickMaster ? styles.inputTypeClick : styles.inputType}
                                    onPress={() => setClickMaster(!clickMaster)} >
                                    <Text style={clickMaster ? {color: 'white'} : {color: 'black'}}>Master Room</Text>
                                </Pressable>
                            </View>
                            <Pressable
                                    style={clickStudio ? styles.inputTypeClick2 : styles.inputType2}
                                    onPress={() => setClickStudio(!clickStudio)} >
                                    <Text style={clickStudio ? {color: 'white'} : {color: 'black'}}>Studio</Text>
                            </Pressable>
                            <Text style={styles.title}>Size (Min. sq.ft - Max. sq.ft)</Text>
                            <View style={styles.priceContainer}>
                                <Picker
                                    style={styles.size}
                                    selectedValue={minSize}
                                    mode="dropdown"
                                    onValueChange={(itemValue, itemIndex) => {
                                        setMinSize(itemValue);
                                    }}>
                                    <Picker.Item label="25" value="25" />
                                    <Picker.Item label="50" value="50" />
                                    <Picker.Item label="100" value="100" />
                                    <Picker.Item label="125" value="125" />
                                    <Picker.Item label="150" value="150" />
                                    <Picker.Item label="200" value="200" />
                                </Picker>
                                <Picker
                                    style={styles.size}
                                    selectedValue={maxSize}
                                    mode="dropdown"
                                    onValueChange={(itemValue, itemIndex) => {
                                        setMaxSize(itemValue);
                                    }}>
                                    <Picker.Item label="25" value="25" />
                                    <Picker.Item label="50" value="50" />
                                    <Picker.Item label="100" value="100" />
                                    <Picker.Item label="125" value="125" />
                                    <Picker.Item label="150" value="150" />
                                    <Picker.Item label="200" value="200" />
                                </Picker>
                            </View>
                            <Text style={styles.title}>Preference</Text>
                            <View style={styles.preferenceContainer}>
                                <Picker
                                    style={styles.preferenceSize}
                                    selectedValue={preference}
                                    mode="dropdown"
                                    onValueChange={(itemValue, itemIndex) => {
                                        setPreference(itemValue);
                                    }}>
                                    <Picker.Item label="Select options" color="grey"/>
                                    <Picker.Item label="Male" value="Male" />
                                    <Picker.Item label="Female" value="Female" />
                                    <Picker.Item label="Male or Female" value="Male or Female" />
                                </Picker>
                            </View>
                            <View style={styles.buttonContainer}>
                                {filtering ? (
                                    <Overlay isVisible={true} overlayStyle={{width:150, alignItems: 'center'}}>
                                        <Text>Waiting for Results...</Text>
                                    </Overlay>
                                    ) : null}
                                <TouchableOpacity
                                    style={styles.roundButton}
                                    onPress={applyFilter}>
                                    <Text style={{fontSize: 22, color: '#1589FF'}}>Apply Filter</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
            </Modal>
            <FlatList
                style={styles.postContainer}
                data={post}
                renderItem={({ item }) => (
                    <Post post={item} />
                )} />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    barContainer: {
        height: 60,
        backgroundColor: 'white',
        flexDirection: 'row',
        elevation: 5,
        marginBottom: 10,
    },
    
    arrow: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        marginLeft: 10,
    },

    searchBar: {
        fontSize: 18,
        marginLeft: 20,
        width: '62%',
    },

    filter: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
    },

    title: {
        fontSize: 18,
        color: '#E56717',
        fontWeight: 'bold',
        marginLeft: '6%',
        marginTop: '7%'
    },

    priceContainer: {
        flexDirection: 'row',
        marginTop: '2%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },

    inputContainer: {
        width: width * 0.4,
        height: height * 0.05,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
    },

    roomContainer: {
        flexDirection: 'row',
        marginTop: 20,
        height: height * 0.08,
        marginLeft: '5.5%',
        marginRight: '5.5%',
        flexWrap: 'wrap',
    },

    inputType: {
        borderWidth: 1,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        width: width * 0.25,
        height: height * 0.05,
    },

    inputTypeClick: {
        borderWidth: 2,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        width: width * 0.25,
        height: height * 0.05,
        backgroundColor: '#F39B68',
        borderColor: '#EE6213'
    },

    inputType1: {
        borderWidth: 1,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        width: width * 0.25,
        height: height * 0.05,
        marginLeft: '4%',
        marginRight: '4%',
    },

    inputTypeClick1: {
        borderWidth: 2,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        width: width * 0.25,
        height: height * 0.05,
        marginLeft: '4%',
        marginRight: '4%',
        backgroundColor: '#F39B68',
        borderColor: '#EE6213'
    },

    inputType2: {
        borderWidth: 1,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        width: width * 0.25,
        height: height * 0.05,
        marginLeft: '5.5%'
    },

    inputTypeClick2: {
        borderWidth: 2,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        width: width * 0.25,
        height: height * 0.05,
        marginLeft: '5.5%',
        backgroundColor: '#F39B68',
        borderColor: '#EE6213'
    },

    size: {
        width: '30%',
        marginTop: '2%',
        height: 30
    },

    preferenceSize: {
        width: '60%',
        marginTop: '2%',
        height: 30
    },

    preferenceContainer: {
        marginTop: '2%',
        marginLeft: '10%',
    },

    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '15%'
    },

    roundButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },

});
