import React from 'react'
import { View, Pressable, Text, Image, StyleSheet, Dimensions, StatusBar } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useState } from 'react'
import { auth, db } from '../utils/FirebaseConfig'
import * as firebase from 'firebase'
import 'firebase/firestore';

const PostResult = (props) => {

    const post = props.post;
    const [saved, setSaved] = useState(false);

    const navigation = useNavigation();

    const saveToList = () => {
        console.log(post.key);
        db.collection('users')
            .doc(auth.currentUser.uid)
            .update({
                savedList: firebase.firestore.FieldValue.arrayUnion(post.key),
            })
            .then(() => {
                setSaved(true);
            });
    }

    return (
        <Pressable style={styles.container}
            onPress={() => {
                navigation.navigate('PostDetail', {
                    post: post
                });
            }}>
            <StatusBar style="light" />
            <View style={styles.posts}>
                <Image
                    source={{
                        uri: post.postUrl[0],
                    }}
                    style={styles.postImage}
                />
            </View>
            <View style={styles.postInfo}>
                <Text style={styles.description} numberOfLines={2}>{post.title}</Text>
                <Text style={styles.price}>RM {post.price}/month</Text>
                <Text style={styles.location}>Area: {post.location}</Text>
                <View style={styles.room}>
                    <Ionicons name="bed-outline" size={15} />
                    <Text style={styles.type}>{post.type}</Text>
                </View>
            </View>
            <Pressable
                    style={styles.button}
                    onPress={saveToList} >
                    {saved? <AntDesign name="heart" size={15} color="#F433FF"/> :
                    <AntDesign name="hearto" size={15} color="#F433FF"/>}
            </Pressable>
        </Pressable>
    )
};

const styles = StyleSheet.create({
    container: {
        marginTop: '1%',
        marginLeft: '4%',
        marginRight: '4%',
        marginBottom: '2%',
        borderRadius: 10,
        elevation: 5,
        backgroundColor: 'white',
        flexDirection: 'row',
        height: 160,
    },

    posts: {
        padding: '1%',
        width: '52%',
    },  

    postImage: {
        borderRadius: 10,
        height: '100%'
    },

    postInfo: {
        marginLeft: 5,
        paddingTop: 10,
        width: '47%',
    },
    
    description: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: 'bold',
    },

    price: {
        fontWeight: 'bold',
        color: 'orange',
        fontSize: 14,
        marginTop: 8,
    },

    location: {
        marginTop: 5,
        fontSize: 12,
        fontStyle: 'italic',
        color: 'grey',
    },

    room: {
        marginTop: 10,
        flexDirection: 'row',
    },

    type: {
        fontSize: 12,
        color: '#504A4B',
        marginLeft: 5,
    },

    button: {
        alignItems: 'center',
        marginTop: '37%',
        marginLeft: '87%',
        position: 'absolute',
    },

})

export default PostResult;
