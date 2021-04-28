import React from 'react'
import { useState, useEffect } from 'react'
import { View, ScrollView, Text, Linking, Image, StyleSheet, Dimensions, StatusBar, ActivityIndicator } from 'react-native'
import Fontisto from 'react-native-vector-icons/Fontisto'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { db, auth } from '../utils/FirebaseConfig'
import { Pressable } from 'react-native'
import Swiper from 'react-native-swiper'

const {width} = Dimensions.get('window');
const height = width * 0.6;

const PostDetail = (props) => {

    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    const getUser = async () => {
        const documentSnapshot = await db.collection('users')
            .doc(props.route.params.post.userId)
            .get();
    
        const userData = documentSnapshot.data();
        setUser(userData);
        setLoading(false);
    };
    
    useEffect(() => {
        getUser();
        return () => {
            setUser({});
            setLoading(true);
        };
    }, []);

    const [showWifi, setShowWifi] = useState(props.route.params.post.wifi);
    const [showAirConditioning, setShowAirConditioning] = useState(props.route.params.post.aircon);
    const [showGym, setShowGym] = useState(props.route.params.post.gym);
    const [showBathroom, setShowBathroom] = useState(props.route.params.post.bathroom);
    const [showPool, setShowPool] = useState(props.route.params.post.pool);

    
    const changeImage = (nativeEvent) => {
        
    };

    if(loading) {
        return <ActivityIndicator />;
    }

    const fullName = user.lastName + " " + user.firstName;
    const images = props.route.params.post.postUrl;

    const onSendWhatsapp = () => {
        const whatsappTxt = "Hi I am interested in: [" + props.route.params.post.title + "]";
        const url = 'whatsapp://send?text=' + whatsappTxt + '&phone=6' + user.phoneNum;
        Linking.openURL(url).then((data) => {
            console.log('WhatsApp Opened');
        }).catch(() => {
            alert('Make sure Whatsapp has been installed on your device!');
        });
    };


    return (
        <ScrollView contentContainerStyle={{paddingVertical: 20}} style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.posts}>
                <Swiper style={styles.swiper} showsButtons={true} horizontal>
                    {
                        images.map((image, index) => (
                            <Image
                                key={index}
                                source={{uri: image}}
                                style={styles.postImage}
                            />
                        ))
                    }
                </Swiper>
            </View>
            <Text style={styles.price}>RM {props.route.params.post.price}/month</Text>
            <Text style={styles.title}>{props.route.params.post.title}</Text>
            <Text style={styles.location}>Location: {props.route.params.post.location}</Text>
            <View style={styles.descriptionContainer}>
                <Text style={styles.addr}>Address</Text>
                <Text style={styles.description}>{props.route.params.post.address}</Text>
            </View>
            <View style={styles.descriptionContainer}>
                <Text style={styles.descrp}>Description</Text>
                <Text style={styles.description}>{props.route.params.post.description}</Text>
            </View>
            <View style={styles.facilityContainer}>
                <Text style={styles.fac}>Facilities</Text>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    {showWifi ? (
                        <View style={styles.facilities}>
                            <Fontisto name="wifi" size={14} color="#808B96" />
                            <Text style={{fontSize: 14, marginLeft: 15, color:"#808B96"}}>Wifi Access</Text>
                        </View>) : null}
                    {showAirConditioning ? (
                        <View style={styles.facilities}>
                            <MaterialCommunityIcons name="air-conditioner" size={19} color="#808B96" />
                            <Text style={{fontSize: 14, marginLeft: 15, color:"#808B96"}}>Air-Conditioning</Text>
                        </View>) : null}
                    {showGym ? (
                        <View style={styles.facilities}>
                            <MaterialIcons name="fitness-center" size={18} color="#808B96"/>
                            <Text style={{fontSize: 14, marginLeft: 15, color:"#808B96"}}>Gymnasium</Text>
                        </View>) : null}
                    {showBathroom ? (
                        <View style={styles.facilities}>
                            <FontAwesome name="bath" size={18} color="#808B96" />
                            <Text style={{fontSize: 14, marginLeft: 15, color:"#808B96"}}>Private Bathroom</Text>
                        </View>) : null}
                    {showPool ? (
                        <View style={styles.facilities}>
                            <MaterialIcons name="pool" size={18} color="#808B96" />
                            <Text style={{fontSize: 14, marginLeft: 15, color:"#808B96"}}>Swimming Pool</Text>
                        </View>) : null}
                </View>
            </View>
            <View style={styles.sellerContainer}>
                <Text style={styles.sellerTitle}>Seller's Information</Text>
            </View>
            <View style={styles.firstContainer}>
                <Image
                    style={styles.image}
                    source={{
                        uri: user.photo,
                    }}
                />
                <View style={styles.sellerInfo}>
                    <Text style={styles.infoName}>{fullName}</Text>
                    <View style={{flexDirection: 'row', marginTop: 3}}>
                        <Fontisto name="email" size={17} color="#808B96" style={{marginTop: 4,}}/>
                        <Text style={styles.infoEmail}>{user.email}</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 3}}>
                        <SimpleLineIcons name="phone" size={16} color="#808B96" style={{marginTop: 4,}}/>
                        <Text style={styles.infoPhoneNum}>{user.phoneNum}</Text>
                        <Pressable style={{marginLeft: 10,}} onPress={onSendWhatsapp}>
                            <FontAwesome name="whatsapp" size={20} color="#808B96"/>
                        </Pressable>
                    </View>
                </View>
            </View>
            <View style={{borderBottomWidth: 1, marginLeft: 25, marginRight: 25, marginTop: 8}}></View>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    posts: {
        alignItems: 'center',
        borderRadius: 10,
        height: '35%',
        marginLeft: 15,
        marginRight: 15,
    },

    swiper: {
        height: 280,
    },

    postImage: {
        width: '100%',
        resizeMode: 'cover',
        borderRadius: 10,
        height: '100%',
        
    },
    
    title: {
        marginLeft: 18,
        marginTop: 10,
        fontSize: 18,
        lineHeight: 20,
        fontWeight: 'bold',
        marginRight: 18,
    },

    price: {
        fontWeight: 'bold',
        color: 'orange',
        fontSize: 22,
        marginLeft: 18,
        marginTop: 25,
    },

    location: {
        marginLeft: 18,
        marginTop: 7,
        fontSize: 16,
        fontStyle: 'italic',
        color: '#504A4B',
    },

    descriptionContainer: {
        marginLeft: 19,
        borderWidth: 0.5,
        marginRight: 20,
        marginTop: 25,
        borderRadius: 10,
    },

    addr: {
        marginTop: -10,
        backgroundColor: 'white',
        width: 75,
        textAlign: 'center',
        marginLeft: 14,
        fontSize: 15,
        fontFamily: 'serif'
    },

    fac: {
        marginTop: -10,
        backgroundColor: 'white',
        width: 75,
        textAlign: 'center',
        marginLeft: 2,
        fontSize: 15,
        fontFamily: 'serif'
    },

    descrp: {
        marginTop: -10,
        backgroundColor: 'white',
        width: 100,
        textAlign: 'center',
        marginLeft: 14,
        fontSize: 15,
        fontFamily: 'serif'
    },

    description: {
        fontSize: 14,
        marginLeft: 14,
        marginTop: 8,
        marginBottom: 15,
        color: '#808B96',
    },

    facilityContainer:{
        marginLeft: 19,
        borderWidth: 0.5,
        marginRight: 20,
        marginTop: 25,
        borderRadius: 10,
        paddingLeft: 14,
        paddingRight: 14,
        paddingBottom: 15,
    },

    facilities:{
        marginTop: 10,
        flexDirection: 'row',
        width: '50%',
    },

    sellerContainer: {
        borderTopWidth: 1,
        marginLeft: 25,
        marginRight: 25,
        marginTop: 30,
        alignItems: 'center'
    },

    sellerTitle: {
        marginTop: -12,
        backgroundColor: 'white',
        width: 150,
        textAlign: 'center',
        marginLeft: 2,
        fontSize: 15,
        fontFamily: 'serif'
    },

    firstContainer: {
        marginLeft: 25,
        marginRight: 25,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 40,
    },

    image: {
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 10,
        marginRight: 30,
    },

    sellerInfo: {
        marginLeft: 30,
    },

    infoName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#F62217',
    },

    infoEmail: {
        fontSize: 16,
        marginBottom: 5,
        marginLeft: 10,
    },

    infoPhoneNum: {
        fontSize: 16,
        marginBottom: 5,
        marginLeft: 10,
    }

})

export default PostDetail;
